from django.urls import path
from .views import alert_list_create, alert_detail, trigger_test_alert, check_energy_rules

urlpatterns = [
    path('', alert_list_create, name='alert-list-create'),
    path('test/', trigger_test_alert, name='alert-test-trigger'),
    path('check/', check_energy_rules, name='alert-rule-check'),
    path('<str:pk>/', alert_detail, name='alert-detail'),
]
