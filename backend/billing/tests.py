from django.test import TestCase
from django.contrib.auth import get_user_model
from facilities.models import Facility
from .models import Bill


class BillingAPITests(TestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(
            email='billing-admin@example.com',
            name='Billing Admin',
            password='strongpass123',
            role='Admin',
        )
        self.facility = Facility.objects.create(
            id='fac-bill-01',
            name='Billing Campus',
            location='Bengaluru',
            type='Commercial Campus',
            current_consumption=180.0,
            monthly_consumption=25000.0,
            estimated_cost=180000.0,
            renewable_percentage=26.0,
            status='Normal',
            solar_capacity_kwp=90.0,
            peak_threshold_kw=200.0,
            floor_area_sq_ft=110000.0,
        )

    def test_valid_bill_creation_returns_201(self):
        self.client.force_login(self.user)
        payload = {
            'facility': self.facility.id,
            'invoice_no': 'INV-BILL-001',
            'billing_period': 'Sep 2026',
            'due_date': '15 Oct 2026',
            'units_consumed': 12000.0,
            'solar_generated_kwh': 3000.0,
            'tariff': 7.5,
            'peak_hour_surcharges': 5000.0,
            'fixed_demand_charges': 10000.0,
            'solar_credit': 12000.0,
            'taxes_and_duties': 3000.0,
            'status': 'Due',
        }

        response = self.client.post('/api/billing/', payload, content_type='application/json')

        self.assertEqual(response.status_code, 201, response.json())
        self.assertTrue(response.json()['success'])
        self.assertEqual(response.json()['data']['invoice_no'], 'INV-BILL-001')
        self.assertTrue(Bill.objects.filter(invoice_no='INV-BILL-001').exists())

    def test_anonymous_bill_creation_requires_auth(self):
        payload = {
            'facility': self.facility.id,
            'invoice_no': 'INV-BILL-ANON',
            'billing_period': 'Sep 2026',
            'due_date': '15 Oct 2026',
            'units_consumed': 12000.0,
        }

        response = self.client.post('/api/billing/', payload, content_type='application/json')

        self.assertEqual(response.status_code, 403)
        self.assertFalse(response.json()['success'])

    def test_missing_required_bill_fields_are_rejected(self):
        self.client.force_login(self.user)

        response = self.client.post('/api/billing/', {'facility': self.facility.id}, content_type='application/json')

        self.assertEqual(response.status_code, 400)
        self.assertFalse(response.json()['success'])
        self.assertIn('invoice_no', response.json().get('errors', {}))
