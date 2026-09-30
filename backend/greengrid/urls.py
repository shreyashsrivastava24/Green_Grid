from django.contrib import admin
from django.urls import path, include
from energy.views import renewable_energy_view
from analytics.views import dashboard_view, analytics_view

urlpatterns = [
    path('admin/', admin.site.urls),

    # Authentication & Profile
    path('api/auth/', include('users.urls')),

    # Facility Management
    path('api/facilities/', include('facilities.urls')),

    # Energy Readings & Telemetry
    path('api/energy/', include('energy.urls')),

    # Renewable Energy Intelligence
    path('api/renewables/', renewable_energy_view, name='renewables-api'),

    # Billing & Utility Statements
    path('api/billing/', include('billing.urls')),

    # Alerts & Anomaly Detection
    path('api/alerts/', include('alerts.urls')),

    # Energy Conservation Recommendations
    path('api/recommendations/', include('recommendations.urls')),

    # Dashboard & Analytics
    path('api/dashboard/', dashboard_view, name='dashboard-api'),
    path('api/analytics/', analytics_view, name='analytics-api'),
]
