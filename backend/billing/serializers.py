from rest_framework import serializers
from .models import Bill

class BillSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)

    # CamelCase aliases matching frontend TypeScript Bill interface
    invoiceNo = serializers.CharField(source='invoice_no', required=False)
    billingPeriod = serializers.CharField(source='billing_period', required=False)
    dueDate = serializers.CharField(source='due_date', required=False)
    facilityName = serializers.CharField(source='facility_name', required=False)
    unitsConsumedKwh = serializers.FloatField(source='units_consumed', required=False)
    solarGeneratedKwh = serializers.FloatField(source='solar_generated_kwh', required=False)
    netBilledUnitsKwh = serializers.FloatField(source='net_billed_units_kwh', required=False)
    baseRatePerKwh = serializers.FloatField(source='tariff', required=False)
    baseEnergyChargesInr = serializers.FloatField(source='base_energy_charges', required=False)
    peakHourSurchargesInr = serializers.FloatField(source='peak_hour_surcharges', required=False)
    fixedDemandChargesInr = serializers.FloatField(source='fixed_demand_charges', required=False)
    solarCreditInr = serializers.FloatField(source='solar_credit', required=False)
    taxesAndDutiesInr = serializers.FloatField(source='taxes_and_duties', required=False)
    totalAmountInr = serializers.FloatField(source='total_amount', required=False)

    class Meta:
        model = Bill
        fields = [
            'id',
            'facility',
            'facility_name',
            'invoice_no',
            'billing_period',
            'due_date',
            'units_consumed',
            'solar_generated_kwh',
            'net_billed_units_kwh',
            'tariff',
            'base_energy_charges',
            'peak_hour_surcharges',
            'fixed_demand_charges',
            'solar_credit',
            'taxes_and_duties',
            'total_amount',
            'status',
            # Aliases
            'invoiceNo',
            'billingPeriod',
            'dueDate',
            'facilityName',
            'unitsConsumedKwh',
            'solarGeneratedKwh',
            'netBilledUnitsKwh',
            'baseRatePerKwh',
            'baseEnergyChargesInr',
            'peakHourSurchargesInr',
            'fixedDemandChargesInr',
            'solarCreditInr',
            'taxesAndDutiesInr',
            'totalAmountInr',
            'created_at',
        ]
        read_only_fields = ['id', 'created_at']
