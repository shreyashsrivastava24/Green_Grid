from django.urls import path
from .views import dashboard_view, analytics_view

urlpatterns = [
    path('dashboard/', dashboard_view, name='dashboard-view'),
    path('analytics/', analytics_view, name='analytics-view'),
]
