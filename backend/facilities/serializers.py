from rest_framework import serializers
from .models import Facility

class FacilitySerializer(serializers.ModelSerializer):
    # CamelCase aliases matching frontend TypeScript Facility interface
    currentConsumptionKw = serializers.FloatField(source='current_consumption', required=False)
    monthlyConsumptionKwh = serializers.FloatField(source='monthly_consumption', required=False)
    estimatedCostInr = serializers.FloatField(source='estimated_cost', required=False)
    renewableSharePercent = serializers.FloatField(source='renewable_percentage', required=False)
    solarCapacityKwp = serializers.FloatField(source='solar_capacity_kwp', required=False)
    peakThresholdKw = serializers.FloatField(source='peak_threshold_kw', required=False)
    peakUsageWindow = serializers.CharField(source='peak_usage_window', required=False)
    gridSharePercent = serializers.FloatField(source='grid_share_percent', required=False)
    floorAreaSqFt = serializers.FloatField(source='floor_area_sq_ft', required=False)
    monthlySavingsInr = serializers.FloatField(source='monthly_savings_inr', required=False)

    class Meta:
        model = Facility
        fields = [
            'id',
            'name',
            'location',
            'type',
            'current_consumption',
            'monthly_consumption',
            'estimated_cost',
            'renewable_percentage',
            'status',
            'solar_capacity_kwp',
            'peak_threshold_kw',
            'peak_usage_window',
            'grid_share_percent',
            'floor_area_sq_ft',
            'monthly_savings_inr',
            # Aliases
            'currentConsumptionKw',
            'monthlyConsumptionKwh',
            'estimatedCostInr',
            'renewableSharePercent',
            'solarCapacityKwp',
            'peakThresholdKw',
            'peakUsageWindow',
            'gridSharePercent',
            'floorAreaSqFt',
            'monthlySavingsInr',
            'created_at',
            'updated_at',
        ]
        extra_kwargs = {
            'id': {'required': False},
        }

    def create(self, validated_data):
        # Handle aliases when creating
        return super().create(validated_data)
