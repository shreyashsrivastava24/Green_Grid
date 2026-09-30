from django.test import TestCase, Client
from django.utils import timezone
from users.models import User
from facilities.models import Facility
from energy.models import EnergyReading
from billing.models import Bill
from alerts.models import Alert
from recommendations.models import Recommendation
import json

class GreenGridIntegrationTests(TestCase):
    def setUp(self):
        self.client = Client()
        # Seed test user
        self.user = User.objects.create_user(
            email='test.operator@greengrid.internal',
            name='Test Operator',
            role='Admin'
        )
        self.user.set_password('password123')
        self.user.save()

        # Seed test facility
        self.facility = Facility.objects.create(
            id='fac-test-01',
            name='Test Campus Alpha',
            location='Bengaluru, Karnataka',
            type='Commercial Tech Campus',
            current_consumption=350.0,
            monthly_consumption=42000.0,
            estimated_cost=336000.0,
            renewable_percentage=30.0,
            solar_capacity_kwp=150.0,
            peak_threshold_kw=400.0,
            floor_area_sq_ft=150000.0,
        )

        # Seed reading
        self.reading = EnergyReading.objects.create(
            facility=self.facility,
            timestamp=timezone.now(),
            date=timezone.now().date(),
            interval='hourly',
            time_label='12:00',
            grid_consumption_kwh=250.0,
            solar_generation_kwh=100.0,
        )

    def test_facility_list_and_search(self):
        # Test listing facilities
        resp = self.client.get('/api/facilities/')
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertTrue(data.get('success'))
        self.assertGreaterEqual(len(data.get('data', [])), 1)

        # Test search
        resp_search = self.client.get('/api/facilities/?q=Alpha')
        self.assertEqual(resp_search.status_code, 200)
        search_data = resp_search.json()
        self.assertEqual(len(search_data.get('data', [])), 1)

    def test_energy_reading_calculation(self):
        # Verify auto-calculated fields in model save
        self.assertEqual(self.reading.consumption_kwh, 350.0)
        self.assertEqual(self.reading.cost, 1875.0) # 250 * 7.5

    def test_billing_calculation(self):
        bill = Bill.objects.create(
            facility=self.facility,
            invoice_no='INV-TEST-001',
            billing_period='Sep 2026',
            due_date='15 Oct 2026',
            units_consumed=10000.0,
            solar_generated_kwh=3000.0,
            tariff=7.5,
            peak_hour_surcharges=5000.0,
            fixed_demand_charges=10000.0,
            solar_credit=12000.0,
            taxes_and_duties=3000.0,
        )
        self.assertEqual(bill.net_billed_units_kwh, 7000.0)
        self.assertEqual(bill.base_energy_charges, 52500.0)
        # Total = 52500 + 5000 + 10000 + 3000 - 12000 = 58500
        self.assertEqual(bill.total_amount, 58500.0)

    def test_alerts_rule_check(self):
        # Trigger peak overload
        self.facility.current_consumption = 450.0 # Exceeds peak_threshold_kw of 400.0
        self.facility.save()

        resp = self.client.post('/api/alerts/check/')
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertTrue(data.get('success'))
        self.assertGreaterEqual(data.get('data', {}).get('alerts_created', 0), 1)

    def test_recommendation_generation(self):
        resp = self.client.post('/api/recommendations/generate/')
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertTrue(data.get('success'))

    def test_dashboard_api(self):
        resp = self.client.get('/api/dashboard/')
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertTrue(data.get('success'))
        self.assertIn('kpi', data.get('data', {}))

    def test_analytics_api(self):
        resp = self.client.get('/api/analytics/?timeframe=30d')
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertTrue(data.get('success'))
        self.assertIn('metrics', data.get('data', {}))

    def test_renewables_api(self):
        resp = self.client.get('/api/renewables/')
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertTrue(data.get('success'))
        self.assertIn('avoidedCo2Tonnes', data.get('data', {}))
