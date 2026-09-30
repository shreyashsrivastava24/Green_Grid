from django.contrib import admin
from .models import EnergyReading

@admin.register(EnergyReading)
class EnergyReadingAdmin(admin.ModelAdmin):
    list_display = ('facility', 'timestamp', 'interval', 'consumption_kwh', 'grid_consumption_kwh', 'solar_generation_kwh', 'cost')
    list_filter = ('interval', 'facility', 'date')
    search_fields = ('facility__name',)
