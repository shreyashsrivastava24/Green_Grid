import urllib.request
import urllib.parse
import urllib.error
import json
import sys

BASE_URL = "http://127.0.0.1:8000/api"

class TestRunner:
    def __init__(self):
        self.passed = 0
        self.failed = 0
        self.token = None

    def request(self, method, path, data=None, auth=True):
        url = f"{BASE_URL}{path}"
        headers = {"Content-Type": "application/json"}
        if auth and self.token:
            headers["Authorization"] = f"Bearer {self.token}"

        body = json.dumps(data).encode('utf-8') if data else None
        req = urllib.request.Request(url, data=body, headers=headers, method=method)

        try:
            with urllib.request.urlopen(req) as resp:
                status_code = resp.status
                resp_data = json.loads(resp.read().decode('utf-8'))
                return status_code, resp_data
        except urllib.error.HTTPError as e:
            try:
                error_body = json.loads(e.read().decode('utf-8'))
            except Exception:
                error_body = {"raw": str(e)}
            return e.code, error_body
        except Exception as e:
            return 0, {"error": str(e)}

    def check(self, name, condition, details=""):
        if condition:
            self.passed += 1
            print(f"  [PASS] {name}")
        else:
            self.failed += 1
            print(f"  [FAIL] {name} - {details}")

    def run_all(self):
        print("\n=======================================================")
        print(" GREENGRID EMIS - COMPREHENSIVE BACKEND TEST SUITE")
        print("=======================================================\n")

        # -----------------------------------------------------
        print("1. USER AUTHENTICATION & JWT")
        # -----------------------------------------------------
        # 1.1 Demo Login
        status, data = self.request("POST", "/auth/demo/", {"email": "arjun.s@greengrid.internal"}, auth=False)
        self.check("POST /auth/demo/ returns 200", status == 200 and data.get("success") is True, str(data))
        if status == 200 and "tokens" in data.get("data", {}):
            self.token = data["data"]["tokens"]["access"]
            self.refresh_token = data["data"]["tokens"]["refresh"]

        # 1.2 Standard Login
        status, data = self.request("POST", "/auth/login/", {"email": "arjun.s@greengrid.internal", "password": "admin123"}, auth=False)
        self.check("POST /auth/login/ with valid credentials returns 200", status == 200 and data.get("success") is True, str(data))

        # 1.3 Invalid Login
        status, data = self.request("POST", "/auth/login/", {"email": "arjun.s@greengrid.internal", "password": "wrongpassword"}, auth=False)
        self.check("POST /auth/login/ with invalid password returns 401", status == 401 and data.get("success") is False, str(data))

        # 1.4 Register New Operator
        test_email = f"operator_{id(self)}@greengrid.internal"
        status, data = self.request("POST", "/auth/register/", {
            "name": "Test Operator",
            "email": test_email,
            "password": "password123",
            "confirm_password": "password123",
            "role": "Facility Manager",
            "department": "Campus Operations"
        }, auth=False)
        self.check("POST /auth/register/ creates new operator", status == 201 and data.get("success") is True, str(data))

        # 1.5 Authenticated Profile Fetch
        status, data = self.request("GET", "/auth/me/")
        self.check("GET /auth/me/ returns authenticated user profile", status == 200 and "email" in data.get("data", {}), str(data))

        # 1.6 Token Refresh
        if hasattr(self, 'refresh_token'):
            status, data = self.request("POST", "/auth/token/refresh/", {"refresh": self.refresh_token}, auth=False)
            self.check("POST /auth/token/refresh/ returns new access token", status == 200 and "access" in data, str(data))

        # -----------------------------------------------------
        print("\n2. FACILITY MANAGEMENT (CRUD & FILTERING)")
        # -----------------------------------------------------
        # 2.1 List Facilities
        status, data = self.request("GET", "/facilities/")
        facilities = data.get("data", [])
        self.check("GET /facilities/ lists campuses", status == 200 and len(facilities) >= 5, f"Count: {len(facilities)}")

        # 2.2 Search Facilities
        status, data = self.request("GET", "/facilities/?q=Bangalore")
        self.check("GET /facilities/?q=Bangalore filters by keyword", status == 200 and len(data.get("data", [])) >= 1, str(data))

        # 2.3 Status Filter
        status, data = self.request("GET", "/facilities/?status=Normal")
        self.check("GET /facilities/?status=Normal filters by status", status == 200 and len(data.get("data", [])) >= 1, str(data))

        # 2.4 Create Facility
        test_fac_id = f"fac-test-{id(self)}"
        new_facility_payload = {
            "id": test_fac_id,
            "name": "Kolkata Tech Hub",
            "location": "Salt Lake Sector V, Kolkata",
            "type": "Commercial Tech Campus",
            "current_consumption": 210.0,
            "monthly_consumption": 22000.0,
            "estimated_cost": 176000.0,
            "renewable_percentage": 25.0,
            "status": "Normal",
            "solar_capacity_kwp": 75.0,
            "peak_threshold_kw": 250.0,
            "peak_usage_window": "13:00 - 17:00",
            "floor_area_sq_ft": 90000.0
        }
        status, data = self.request("POST", "/facilities/", new_facility_payload)
        self.check("POST /facilities/ provisions a new facility", status == 201 and data.get("data", {}).get("id") == test_fac_id, str(data))

        # 2.5 Retrieve Facility
        status, data = self.request("GET", f"/facilities/{test_fac_id}/")
        self.check(f"GET /facilities/{test_fac_id}/ retrieves provisioned facility", status == 200 and data.get("data", {}).get("name") == "Kolkata Tech Hub", str(data))

        # 2.6 Update Facility
        status, data = self.request("PUT", f"/facilities/{test_fac_id}/", {"current_consumption": 235.5, "status": "Attention"})
        self.check(f"PUT /facilities/{test_fac_id}/ updates fields", status == 200 and data.get("data", {}).get("status") == "Attention", str(data))

        # 2.7 Delete Facility
        status, data = self.request("DELETE", f"/facilities/{test_fac_id}/")
        self.check(f"DELETE /facilities/{test_fac_id}/ de-provisions facility", status == 200, str(data))

        # -----------------------------------------------------
        print("\n3. ENERGY CONSUMPTION & TELEMETRY")
        # -----------------------------------------------------
        # 3.1 List Energy Readings
        status, data = self.request("GET", "/energy/")
        self.check("GET /energy/ returns telemetry readings", status == 200 and len(data.get("data", [])) > 0, str(data))

        # 3.2 Facility-Specific Telemetry
        status, data = self.request("GET", "/energy/facility/fac-blr-01/?interval=hourly")
        self.check("GET /energy/facility/fac-blr-01/ returns campus load profile", status == 200 and "readings" in data.get("data", {}), str(data))

        # 3.3 Ingest Telemetry Reading
        new_reading_payload = {
            "facility": "fac-blr-01",
            "timestamp": "2026-09-30T11:00:00Z",
            "date": "2026-09-30",
            "interval": "hourly",
            "time_label": "11:00",
            "consumption_kwh": 395.0,
            "grid_consumption_kwh": 260.0,
            "solar_generation_kwh": 135.0,
            "cost": 1950.0
        }
        status, data = self.request("POST", "/energy/", new_reading_payload)
        self.check("POST /energy/ records new meter telemetry", status == 201 and data.get("success") is True, str(data))

        # -----------------------------------------------------
        print("\n4. DASHBOARD API")
        # -----------------------------------------------------
        status, data = self.request("GET", "/dashboard/")
        d = data.get("data", {})
        kpi = d.get("kpi", {})
        self.check("GET /dashboard/ returns KPI structure", status == 200 and "totalLiveDemandKw" in kpi and "activeAlertsCount" in kpi, str(kpi))
        self.check("GET /dashboard/ returns 24h consumption trend", len(d.get("consumptionTrend", [])) > 0, f"Count: {len(d.get('consumptionTrend', []))}")
        self.check("GET /dashboard/ returns facility comparison", len(d.get("facilityComparison", [])) > 0, f"Count: {len(d.get('facilityComparison', []))}")
        self.check("GET /dashboard/ returns recent alerts", "recentAlerts" in d, str(d.keys()))

        # -----------------------------------------------------
        print("\n5. MULTIVARIATE ENERGY ANALYTICS")
        # -----------------------------------------------------
        for tf in ["24h", "7d", "30d", "ytd"]:
            status, data = self.request("GET", f"/analytics/?timeframe={tf}")
            metrics = data.get("data", {}).get("metrics", {})
            self.check(f"GET /analytics/?timeframe={tf} returns calculations", status == 200 and "averageEnergyIntensity" in metrics, str(metrics))

        self.check("Analytics contains baseline regression profile", len(data.get("data", {}).get("loadProfiles", [])) > 0)
        self.check("Analytics contains facility benchmark ranking", len(data.get("data", {}).get("facilityBenchmarks", [])) > 0)

        # -----------------------------------------------------
        print("\n6. BILLING & UTILITY STATEMENTS")
        # -----------------------------------------------------
        status, data = self.request("GET", "/billing/")
        bills = data.get("data", {}).get("bills", [])
        self.check("GET /billing/ lists utility statements", status == 200 and len(bills) >= 4, f"Count: {len(bills)}")
        self.check("Billing response includes monthly cost trend", len(data.get("data", {}).get("monthlyCostTrend", [])) == 6)

        # 6.2 Retrieve Single Bill
        if len(bills) > 0:
            first_bill_id = bills[0]["id"]
            status, data = self.request("GET", f"/billing/{first_bill_id}/")
            self.check(f"GET /billing/{first_bill_id}/ returns bill statement", status == 200 and "invoiceNo" in data.get("data", {}), str(data))

        # -----------------------------------------------------
        print("\n7. RENEWABLE ENERGY INTELLIGENCE")
        # -----------------------------------------------------
        status, data = self.request("GET", "/renewables/")
        r_data = data.get("data", {})
        self.check("GET /renewables/ returns solar capacity & generation", status == 200 and r_data.get("totalSolarCapacityKwp", 0) > 0, str(r_data))
        self.check("Renewables calculates avoided CO2 (tonnes)", r_data.get("avoidedCo2Tonnes", 0) > 0, str(r_data.get("avoidedCo2Tonnes")))
        self.check("Renewables provides inverter matrix", len(r_data.get("inverterMatrix", [])) >= 5)

        # -----------------------------------------------------
        print("\n8. ALERTS & RULE-BASED ANOMALY DETECTION")
        # -----------------------------------------------------
        status, data = self.request("GET", "/alerts/")
        alerts = data.get("data", [])
        self.check("GET /alerts/ returns incident logs", status == 200 and len(alerts) > 0, f"Count: {len(alerts)}")

        # 8.2 Severity Filter
        status, data = self.request("GET", "/alerts/?severity=Critical")
        self.check("GET /alerts/?severity=Critical filters critical alerts", status == 200 and all(a["severity"] == "Critical" for a in data.get("data", [])))

        # 8.3 Simulate Spike Alert
        status, data = self.request("POST", "/alerts/test/")
        test_alert = data.get("data", {})
        self.check("POST /alerts/test/ triggers test telemetry spike", status == 201 and test_alert.get("title") == "Sudden Inrush Current Spike", str(data))

        # 8.4 Acknowledge & Resolve Alert
        if test_alert.get("id"):
            alt_id = test_alert["id"]
            status, data = self.request("PUT", f"/alerts/{alt_id}/", {"status": "Acknowledged"})
            self.check(f"PUT /alerts/{alt_id}/ marks Acknowledged", status == 200 and data.get("data", {}).get("status") == "Acknowledged")

            status, data = self.request("PUT", f"/alerts/{alt_id}/", {"status": "Resolved"})
            self.check(f"PUT /alerts/{alt_id}/ marks Resolved", status == 200 and data.get("data", {}).get("status") == "Resolved")

        # 8.5 Rule-Based Threshold Check
        status, data = self.request("POST", "/alerts/check/")
        self.check("POST /alerts/check/ executes automated facility rule check", status == 200 and "alerts_created" in data.get("data", {}), str(data))

        # -----------------------------------------------------
        print("\n9. ENERGY RECOMMENDATIONS & AUTOMATION")
        # -----------------------------------------------------
        status, data = self.request("GET", "/recommendations/")
        recs = data.get("data", {}).get("recommendations", [])
        self.check("GET /recommendations/ returns conservation measures", status == 200 and len(recs) > 0, f"Count: {len(recs)}")

        # 9.2 Toggle Applied Status
        if len(recs) > 0:
            rec_id = recs[0]["id"]
            status, data = self.request("PUT", f"/recommendations/{rec_id}/", {"isApplied": True})
            self.check(f"PUT /recommendations/{rec_id}/ applies rule", status == 200 and data.get("data", {}).get("isApplied") is True)

        # 9.3 Recommendation Rule Generator
        status, data = self.request("POST", "/recommendations/generate/")
        self.check("POST /recommendations/generate/ triggers rule engine", status == 200 and "generated_count" in data.get("data", {}), str(data))

        # -----------------------------------------------------
        print("\n10. ERROR HANDLING & SCHEMAS")
        # -----------------------------------------------------
        status, data = self.request("GET", "/facilities/non-existent-facility-999/")
        self.check("GET 404 for invalid facility ID returns standardized error", status == 404 and data.get("success") is False and "message" in data, str(data))

        status, data = self.request("GET", "/alerts/non-existent-alert-999/")
        self.check("GET 404 for invalid alert ID returns standardized error", status == 404 and data.get("success") is False, str(data))

        # -----------------------------------------------------
        print("\n=======================================================")
        print(f" TEST RUN COMPLETE: {self.passed} PASSED, {self.failed} FAILED")
        print("=======================================================\n")
        return self.failed == 0

if __name__ == "__main__":
    runner = TestRunner()
    success = runner.run_all()
    sys.exit(0 if success else 1)
