from django.urls import path
from .views import energy_readings_list_create, facility_energy_readings

urlpatterns = [
    path('', energy_readings_list_create, name='energy-list-create'),
    path('facility/<str:facility_id>/', facility_energy_readings, name='facility-energy-readings'),
]
