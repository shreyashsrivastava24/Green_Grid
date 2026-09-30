from rest_framework import serializers
from .models import Alert

class AlertSerializer(serializers.ModelSerializer):
    # CamelCase aliases matching frontend TypeScript Alert interface
    facilityId = serializers.CharField(source='facility.id', read_only=True)
    facilityName = serializers.CharField(source='facility_name', read_only=True)
    currentValue = serializers.CharField(source='current_value', required=False)
    thresholdValue = serializers.CharField(source='threshold_value', required=False)
    description = serializers.CharField(source='message', required=False)
    timestamp = serializers.SerializerMethodField()

    class Meta:
        model = Alert
        fields = [
            'id',
            'facility',
            'facility_name',
            'title',
            'alert_type',
            'metric',
            'message',
            'severity',
            'status',
            'current_value',
            'threshold_value',
            # Aliases
            'facilityId',
            'facilityName',
            'currentValue',
            'thresholdValue',
            'description',
            'timestamp',
            'created_at',
            'resolved_at',
        ]
        read_only_fields = ['created_at']

    def get_timestamp(self, obj):
        # Format user-friendly timestamp e.g. "Today, 14:24" or date string
        return obj.created_at.strftime('%b %d, %H:%M')
