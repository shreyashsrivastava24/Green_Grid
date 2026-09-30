from rest_framework import serializers
from .models import EnergyReading

class EnergyReadingSerializer(serializers.ModelSerializer):
    facility_name = serializers.CharField(source='facility.name', read_only=True)
    # Frontend aliases matching ConsumptionDataPoint interface
    time = serializers.SerializerMethodField()
    grid = serializers.FloatField(source='grid_consumption_kwh', read_only=True)
    solar = serializers.FloatField(source='solar_generation_kwh', read_only=True)
    total = serializers.FloatField(source='consumption_kwh', read_only=True)

    class Meta:
        model = EnergyReading
        fields = [
            'id',
            'facility',
            'facility_name',
            'timestamp',
            'date',
            'interval',
            'time_label',
            'time',
            'consumption_kwh',
            'grid_consumption_kwh',
            'solar_generation_kwh',
            'cost',
            'grid',
            'solar',
            'total',
            'created_at',
        ]
        read_only_fields = ['id', 'created_at']

    def get_time(self, obj):
        if obj.time_label:
            return obj.time_label
        if obj.interval == 'hourly':
            return obj.timestamp.strftime('%H:%M')
        elif obj.interval == 'daily':
            return obj.timestamp.strftime('%a')
        return obj.timestamp.strftime('%b')
