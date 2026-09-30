from django.contrib import admin
from .models import Bill

@admin.register(Bill)
class BillAdmin(admin.ModelAdmin):
    list_display = ('invoice_no', 'facility_name', 'billing_period', 'units_consumed', 'total_amount', 'status')
    list_filter = ('status', 'billing_period')
    search_fields = ('invoice_no', 'facility_name')
