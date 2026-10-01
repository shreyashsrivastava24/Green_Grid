from django.test import TestCase
from django.contrib.auth import get_user_model


class UserAuthTests(TestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(
            email='auth-user@example.com',
            name='Auth User',
            password='password123',
            role='Admin',
        )

    def test_login_with_valid_credentials_returns_tokens(self):
        response = self.client.post(
            '/api/auth/login/',
            {'email': 'auth-user@example.com', 'password': 'password123'},
            content_type='application/json',
        )

        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()['success'])
        self.assertIn('tokens', response.json()['data'])
        self.assertIn('access', response.json()['data']['tokens'])

    def test_login_with_invalid_password_returns_401(self):
        response = self.client.post(
            '/api/auth/login/',
            {'email': 'auth-user@example.com', 'password': 'wrongpassword'},
            content_type='application/json',
        )

        self.assertEqual(response.status_code, 401)
        self.assertFalse(response.json()['success'])

    def test_me_requires_authentication(self):
        response = self.client.get('/api/auth/me/')

        self.assertEqual(response.status_code, 403)
        self.assertFalse(response.json()['success'])

    def test_me_returns_user_profile_for_authenticated_user(self):
        self.client.force_login(self.user)

        response = self.client.get('/api/auth/me/')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['data']['email'], 'auth-user@example.com')
