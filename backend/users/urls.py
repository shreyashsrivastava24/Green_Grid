from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import register_view, login_view, demo_login_view, logout_view, me_view

urlpatterns = [
    path('register/', register_view, name='auth-register'),
    path('login/', login_view, name='auth-login'),
    path('demo/', demo_login_view, name='auth-demo'),
    path('logout/', logout_view, name='auth-logout'),
    path('me/', me_view, name='auth-me'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
]
