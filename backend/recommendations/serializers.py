from rest_framework import serializers
from .models import Recommendation

class RecommendationSerializer(serializers.ModelSerializer):
    # CamelCase aliases matching frontend TypeScript Recommendation interface
    facilityId = serializers.CharField(source='facility.id', read_only=True)
    facilityName = serializers.CharField(source='facility_name', read_only=True)
    estimatedEnergySavingKwh = serializers.FloatField(source='estimated_energy_saving', required=False)
    estimatedSavingPercent = serializers.FloatField(source='estimated_saving_percent', required=False)
    estimatedCostSavingInr = serializers.FloatField(source='estimated_cost_saving', required=False)
    implementationEffort = serializers.CharField(source='implementation_effort', required=False)
    isApplied = serializers.BooleanField(source='is_applied', required=False)

    class Meta:
        model = Recommendation
        fields = [
            'id',
            'facility',
            'facility_name',
            'title',
            'description',
            'reason',
            'priority',
            'category',
            'implementation_effort',
            'estimated_energy_saving',
            'estimated_saving_percent',
            'estimated_cost_saving',
            'is_applied',
            # Aliases
            'facilityId',
            'facilityName',
            'estimatedEnergySavingKwh',
            'estimatedSavingPercent',
            'estimatedCostSavingInr',
            'implementationEffort',
            'isApplied',
            'created_at',
        ]
        read_only_fields = ['created_at']
