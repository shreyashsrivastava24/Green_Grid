from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import datetime, timedelta
from users.models import User
from facilities.models import Facility
from energy.models import EnergyReading
from billing.models import Bill
from alerts.models import Alert
from recommendations.models import Recommendation

class Command(BaseCommand):
    help = "Seed realistic demo enterprise energy data into GreenGrid database"

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE("Seeding GreenGrid Enterprise EMIS demo dataset..."))

        # 1. Seed Users
        admin_user, created = User.objects.get_or_create(
            email='arjun.s@greengrid.internal',
            defaults={
                'name': 'Arjun Swaminathan',
                'role': 'Admin',
                'department': 'Infrastructure & Operations',
                'organization': 'Apex Enterprise Facilities Group',
                'phone': '+91 98450 12890',
                'avatar_url': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
                'is_staff': True,
                'is_superuser': True,
            }
        )
        if created:
            admin_user.set_password('admin123')
            admin_user.save()
            self.stdout.write(self.style.SUCCESS("Created Admin user: arjun.s@greengrid.internal (password: admin123)"))
        else:
            self.stdout.write("Admin user already exists.")

        manager_user, created = User.objects.get_or_create(
            email='manager@greengrid.internal',
            defaults={
                'name': 'Priya Sharma',
                'role': 'Facility Manager',
                'department': 'Campus Operations',
                'organization': 'Apex Enterprise Facilities Group',
                'phone': '+91 98200 45678',
                'is_staff': False,
            }
        )
        if created:
            manager_user.set_password('manager123')
            manager_user.save()
            self.stdout.write(self.style.SUCCESS("Created Manager user: manager@greengrid.internal (password: manager123)"))

        # 2. Seed Facilities
        facilities_data = [
            {
                'id': 'fac-blr-01',
                'name': 'Bangalore Tech Park Campus',
                'location': 'Electronic City, Bengaluru',
                'type': 'Commercial Tech Campus',
                'current_consumption': 420.5,
                'monthly_consumption': 48500.0,
                'estimated_cost': 388000.0,
                'status': 'Normal',
                'solar_capacity_kwp': 160.0,
                'peak_threshold_kw': 460.0,
                'peak_usage_window': '14:00 – 17:30',
                'grid_share_percent': 64.0,
                'renewable_percentage': 36.0,
                'floor_area_sq_ft': 185000.0,
                'monthly_savings_inr': 135000.0,
            },
            {
                'id': 'fac-pne-02',
                'name': 'Pune Manufacturing Facility',
                'location': 'Chakan Industrial Zone, Pune',
                'type': 'Heavy Industrial Plant',
                'current_consumption': 685.2,
                'monthly_consumption': 64200.0,
                'estimated_cost': 513600.0,
                'status': 'High Usage',
                'solar_capacity_kwp': 180.0,
                'peak_threshold_kw': 650.0,
                'peak_usage_window': '11:30 – 16:00',
                'grid_share_percent': 72.0,
                'renewable_percentage': 28.0,
                'floor_area_sq_ft': 240000.0,
                'monthly_savings_inr': 154000.0,
            },
            {
                'id': 'fac-ggn-03',
                'name': 'Gurugram Corporate Tower',
                'location': 'Cyber Hub Phase II, Gurugram',
                'type': 'High-Rise Office Tower',
                'current_consumption': 310.8,
                'monthly_consumption': 29800.0,
                'estimated_cost': 238400.0,
                'status': 'Critical',
                'solar_capacity_kwp': 60.0,
                'peak_threshold_kw': 290.0,
                'peak_usage_window': '13:00 – 18:00',
                'grid_share_percent': 81.0,
                'renewable_percentage': 19.0,
                'floor_area_sq_ft': 110000.0,
                'monthly_savings_inr': 48000.0,
            },
            {
                'id': 'fac-chn-04',
                'name': 'Chennai Logistics & Cold Hub',
                'location': 'Sriperumbudur corridor, Chennai',
                'type': 'Refrigerated Warehouse',
                'current_consumption': 195.4,
                'monthly_consumption': 18600.0,
                'estimated_cost': 148800.0,
                'status': 'Normal',
                'solar_capacity_kwp': 120.0,
                'peak_threshold_kw': 240.0,
                'peak_usage_window': '12:00 – 15:00',
                'grid_share_percent': 55.0,
                'renewable_percentage': 45.0,
                'floor_area_sq_ft': 95000.0,
                'monthly_savings_inr': 68000.0,
            },
            {
                'id': 'fac-hyd-05',
                'name': 'Hyderabad R&D Innovation Hub',
                'location': 'HITEC City, Hyderabad',
                'type': 'Laboratories & Server Pods',
                'current_consumption': 254.1,
                'monthly_consumption': 24900.0,
                'estimated_cost': 199200.0,
                'status': 'Normal',
                'solar_capacity_kwp': 90.0,
                'peak_threshold_kw': 300.0,
                'peak_usage_window': '14:30 – 17:00',
                'grid_share_percent': 68.0,
                'renewable_percentage': 32.0,
                'floor_area_sq_ft': 130000.0,
                'monthly_savings_inr': 72000.0,
            },
        ]

        created_facilities = []
        for fdata in facilities_data:
            facility, _ = Facility.objects.update_or_create(id=fdata['id'], defaults=fdata)
            created_facilities.append(facility)
        self.stdout.write(self.style.SUCCESS(f"Configured {len(created_facilities)} Facilities."))

        # 3. Seed Hourly & Daily Energy Readings
        blr_fac = Facility.objects.get(
            id='fac-blr-01')
        EnergyReading.objects.filter(facility=blr_fac).delete()

        hourly_profile = [
            ('00:00', 85, 0, 85, 637),
            ('02:00', 78, 0, 78, 585),
            ('04:00', 82, 0, 82, 615),
            ('06:00', 110, 15, 125, 825),
            ('08:00', 240, 65, 305, 1800),
            ('10:00', 320, 145, 465, 2400),
            ('12:00', 360, 195, 555, 2700),
            ('14:00', 410, 175, 585, 3485),
            ('16:00', 380, 110, 490, 3230),
            ('18:00', 290, 25, 315, 2175),
            ('20:00', 185, 0, 185, 1387),
            ('22:00', 125, 0, 125, 937),
        ]

        now = timezone.now()
        today = now.date()

        for time_str, grid, solar, total, cost in hourly_profile:
            hh, mm = map(int, time_str.split(':'))
            ts = timezone.make_aware(datetime.combine(today, datetime.min.time().replace(hour=hh, minute=mm)))
            EnergyReading.objects.create(
                facility=blr_fac,
                timestamp=ts,
                date=today,
                interval='hourly',
                time_label=time_str,
                consumption_kwh=total,
                grid_consumption_kwh=grid,
                solar_generation_kwh=solar,
                cost=cost,
            )

        # Weekly profile for BLR
        weekly_profile = [
            ('Mon', 3450, 1280, 4730, 27600),
            ('Tue', 3620, 1310, 4930, 28960),
            ('Wed', 3580, 1190, 4770, 28640),
            ('Thu', 3790, 1420, 5210, 30320),
            ('Fri', 3650, 1380, 5030, 29200),
            ('Sat', 2100, 1250, 3350, 16800),
            ('Sun', 1650, 1180, 2830, 13200),
        ]
        for day_name, grid, solar, total, cost in weekly_profile:
            EnergyReading.objects.create(
                facility=blr_fac,
                timestamp=now,
                date=today,
                interval='daily',
                time_label=day_name,
                consumption_kwh=total,
                grid_consumption_kwh=grid,
                solar_generation_kwh=solar,
                cost=cost,
            )

        self.stdout.write(self.style.SUCCESS("Generated EnergyReadings (hourly and daily telemetry)."))

        # 4. Seed Bills
        bills_data = [
            {
                'id': 'bill-2026-09',
                'invoice_no': 'GG-INV-2026-09-081',
                'billing_period': '01 Sep 2026 – 30 Sep 2026 (Projected)',
                'due_date': '15 Oct 2026',
                'facility_name': 'Apex Consolidated Facilities',
                'units_consumed': 186000.0,
                'solar_generated_kwh': 48920.0,
                'net_billed_units_kwh': 137080.0,
                'tariff': 7.5,
                'base_energy_charges': 1028100.0,
                'peak_hour_surcharges': 96400.0,
                'fixed_demand_charges': 145000.0,
                'solar_credit': 195680.0,
                'taxes_and_duties': 68980.0,
                'total_amount': 1142800.0,
                'status': 'Due',
            },
            {
                'id': 'bill-2026-08',
                'invoice_no': 'GG-INV-2026-08-042',
                'billing_period': '01 Aug 2026 – 31 Aug 2026',
                'due_date': '15 Sep 2026',
                'facility_name': 'Apex Consolidated Facilities',
                'units_consumed': 182400.0,
                'solar_generated_kwh': 46200.0,
                'net_billed_units_kwh': 136200.0,
                'tariff': 7.5,
                'base_energy_charges': 1021500.0,
                'peak_hour_surcharges': 92800.0,
                'fixed_demand_charges': 145000.0,
                'solar_credit': 184800.0,
                'taxes_and_duties': 67200.0,
                'total_amount': 1141700.0,
                'status': 'Paid',
            },
            {
                'id': 'bill-2026-07',
                'invoice_no': 'GG-INV-2026-07-119',
                'billing_period': '01 Jul 2026 – 31 Jul 2026',
                'due_date': '15 Aug 2026',
                'facility_name': 'Apex Consolidated Facilities',
                'units_consumed': 174000.0,
                'solar_generated_kwh': 44100.0,
                'net_billed_units_kwh': 129900.0,
                'tariff': 7.5,
                'base_energy_charges': 974250.0,
                'peak_hour_surcharges': 88400.0,
                'fixed_demand_charges': 145000.0,
                'solar_credit': 176400.0,
                'taxes_and_duties': 64150.0,
                'total_amount': 1095400.0,
                'status': 'Paid',
            },
            {
                'id': 'bill-2026-06',
                'invoice_no': 'GG-INV-2026-06-088',
                'billing_period': '01 Jun 2026 – 30 Jun 2026',
                'due_date': '15 Jul 2026',
                'facility_name': 'Apex Consolidated Facilities',
                'units_consumed': 198500.0,
                'solar_generated_kwh': 47800.0,
                'net_billed_units_kwh': 150700.0,
                'tariff': 7.5,
                'base_energy_charges': 1130250.0,
                'peak_hour_surcharges': 112000.0,
                'fixed_demand_charges': 145000.0,
                'solar_credit': 191200.0,
                'taxes_and_duties': 74300.0,
                'total_amount': 1270350.0,
                'status': 'Paid',
            },
        ]
        for bdata in bills_data:
            Bill.objects.update_or_create(id=bdata['id'], defaults=bdata)
        self.stdout.write(self.style.SUCCESS(f"Configured {len(bills_data)} utility Statements."))

        # 5. Seed Alerts
        Alert.objects.all().delete()
        alerts_data = [
            {
                'id': 'alt-001',
                'facility': Facility.objects.get(id='fac-ggn-03'),
                'title': 'Peak Demand Exceeded (Critical Overload)',
                'severity': 'Critical',
                'status': 'Active',
                'current_value': '310.8 kW',
                'threshold_value': '290.0 kW limit',
                'message': 'Chiller banks C3 and C4 initiated simultaneously during regional grid peak-pricing window, breaching sanctioned demand limit by 7.2%.',
                'metric': 'Instantaneous Peak Load',
                'alert_type': 'Peak Demand Exceeded',
            },
            {
                'id': 'alt-002',
                'facility': Facility.objects.get(id='fac-pne-02'),
                'title': 'HVAC Chiller Load Anomaly',
                'severity': 'Warning',
                'status': 'Active',
                'current_value': '685.2 kW',
                'threshold_value': '650.0 kW nominal',
                'message': 'Compressor cycling on Line 2 cleanroom cooling unit shows 28% higher power draw than historical baseline for ambient 31°C.',
                'metric': 'Continuous Energy Draw',
                'alert_type': 'HVAC Load Anomaly',
            },
            {
                'id': 'alt-003',
                'facility': Facility.objects.get(id='fac-blr-01'),
                'title': 'Solar Inverter String 4 Underperformance',
                'severity': 'Warning',
                'status': 'Active',
                'current_value': '18.4 kW yield',
                'threshold_value': '28.0 kW expected',
                'message': 'Rooftop string 4 output is 34% below adjacent string 3 despite identical global solar irradiance (890 W/m²). Potential dust accumulation or DC junction issue.',
                'metric': 'Solar String Efficiency',
                'alert_type': 'Solar Inverter Anomaly',
            },
            {
                'id': 'alt-004',
                'facility': Facility.objects.get(id='fac-pne-02'),
                'title': 'Power Factor Degradation',
                'severity': 'Warning',
                'status': 'Acknowledged',
                'current_value': '0.88 Lagging',
                'threshold_value': '0.95 Minimum',
                'message': 'Capacitor bank 2 failed to switch online during heavy induction motor startup, risking ₹18,500 DISCOM low power factor penalty.',
                'metric': 'Power Factor (cos φ)',
                'alert_type': 'Power Factor Anomaly',
            },
            {
                'id': 'alt-005',
                'facility': Facility.objects.get(id='fac-hyd-05'),
                'title': 'Unscheduled Off-Hours Base Load',
                'severity': 'Info',
                'status': 'Resolved',
                'current_value': '64.2 kW',
                'threshold_value': '40.0 kW target',
                'message': 'Level 3 laboratory AHU and test bench lights were left energized overnight. Automatically adjusted by building automation.',
                'metric': 'Baseload Overnight Draw',
                'alert_type': 'Off-Hours Baseload',
            },
        ]
        for adata in alerts_data:
            Alert.objects.create(**adata)
        self.stdout.write(self.style.SUCCESS(f"Logged {len(alerts_data)} Anomaly Alerts."))

        # 6. Seed Recommendations
        Recommendation.objects.all().delete()
        recs_data = [
            {
                'id': 'rec-101',
                'facility': Facility.objects.get(id='fac-blr-01'),
                'title': 'Pre-cool Thermal Mass Prior to Peak Tariff Window',
                'priority': 'High',
                'category': 'HVAC Optimization',
                'estimated_energy_saving': 4200.0,
                'estimated_saving_percent': 12.5,
                'estimated_cost_saving': 33600.0,
                'reason': 'Electricity tariffs double between 14:00 and 18:00 (₹11.20/kWh vs ₹6.80/kWh off-peak). Pre-cooling buildings to 21.5°C before 13:30 allows chilled water loop coasting during peak tariff hours.',
                'description': 'Automate Building Management System (BMS) thermostat setpoints to sub-cool office zones between 11:30 and 13:30, then float setpoint to 24°C through peak hours.',
                'implementation_effort': 'Immediate (Automated)',
                'is_applied': False,
            },
            {
                'id': 'rec-102',
                'facility': Facility.objects.get(id='fac-pne-02'),
                'title': 'Shift Chilled Water & Pump Cycling Away from Peak',
                'priority': 'High',
                'category': 'Peak Shaving',
                'estimated_energy_saving': 6800.0,
                'estimated_saving_percent': 14.2,
                'estimated_cost_saving': 54400.0,
                'reason': 'Pune plant draws 685 kW against a contracted demand cap of 650 kW. Secondary pump staging currently coincides with shift change peak loads.',
                'description': 'Interlock 45 kW secondary process pumps with the automated demand limiter. Stagger water storage pump fills to night hours (22:00 – 06:00).',
                'implementation_effort': 'Immediate (Automated)',
                'is_applied': False,
            },
            {
                'id': 'rec-103',
                'facility': Facility.objects.get(id='fac-ggn-03'),
                'title': 'Automated Corridor & Parking Daylight Harvesting',
                'priority': 'Medium',
                'category': 'Lighting',
                'estimated_energy_saving': 1850.0,
                'estimated_saving_percent': 8.4,
                'estimated_cost_saving': 14800.0,
                'reason': 'Perimeter atrium and basement levels B1-B2 lighting remains at 100% luminosity despite ample natural daylight lux readings exceeding 650 lx.',
                'description': 'Enable DALI daylight harvesting dimming sensors to throttle perimeter luminaire output to 25% between 09:00 and 17:00 on sunny days.',
                'implementation_effort': 'Low (1-2 days)',
                'is_applied': False,
            },
            {
                'id': 'rec-104',
                'facility': Facility.objects.get(id='fac-blr-01'),
                'title': 'Automated Solar Panel Wet-Cleaning Schedule',
                'priority': 'Medium',
                'category': 'Solar & Battery',
                'estimated_energy_saving': 2600.0,
                'estimated_saving_percent': 5.8,
                'estimated_cost_saving': 20800.0,
                'reason': 'Dust soiling index in Electronic City area has reduced String 4-6 solar generation efficiency by 8.4% over the last 18 dry days.',
                'description': 'Trigger robotic or sprinkler array washing cycle tonight at 21:00 to recover ~85 kWh daily solar harvest capacity.',
                'implementation_effort': 'Immediate (Automated)',
                'is_applied': True,
            },
            {
                'id': 'rec-105',
                'facility': Facility.objects.get(id='fac-chn-04'),
                'title': 'Reschedule Battery Inverter Charging to Solar Surplus Hours',
                'priority': 'Low',
                'category': 'Solar & Battery',
                'estimated_energy_saving': 2950.0,
                'estimated_saving_percent': 9.1,
                'estimated_cost_saving': 21200.0,
                'reason': 'BESS battery bank currently starts grid charging at 06:00 AM before solar irradiance ramps up, consuming grid power at commercial rates.',
                'description': 'Reprogram charge controller profile to prioritize rooftop PV array generation from 10:30 to 14:30 when ambient cold room demand is stable.',
                'implementation_effort': 'Immediate (Automated)',
                'is_applied': False,
            },
        ]
        for rdata in recs_data:
            Recommendation.objects.create(**rdata)
        self.stdout.write(self.style.SUCCESS(f"Generated {len(recs_data)} Conservation Recommendations."))

        self.stdout.write(self.style.SUCCESS("[OK] GreenGrid database successfully seeded with enterprise demo data!"))
