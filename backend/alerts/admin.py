from django.contrib import admin
from .models import Alert

@admin.register(Alert)
class AlertAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'facility_name', 'severity', 'status', 'created_at')
    list_filter = ('severity', 'status')
    search_fields = ('title', 'facility_name', 'message')
