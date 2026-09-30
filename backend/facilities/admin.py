from django.contrib import admin
from .models import Facility

@admin.register(Facility)
class FacilityAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'location', 'type', 'status', 'current_consumption', 'renewable_percentage')
    list_filter = ('status', 'type')
    search_fields = ('name', 'location', 'type')
