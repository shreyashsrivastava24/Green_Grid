from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework import status
from django.utils import timezone
from greengrid.utils import api_response, api_error, IsAdminOrFacilityManagerOrReadOnly
from facilities.models import Facility
from .models import Alert
from .serializers import AlertSerializer

@api_view(['GET', 'POST'])
@permission_classes([IsAdminOrFacilityManagerOrReadOnly])
def alert_list_create(request):
    """
    GET /api/alerts/ - List alerts with optional status, severity, or facility filter.
    POST /api/alerts/ - Create a new telemetry alert.
    """
    if request.method == 'GET':
        alerts = Alert.objects.select_related('facility').all()

        facility_id = request.query_params.get('facility_id') or request.query_params.get('facility')
        if facility_id and facility_id.lower() != 'all':
            alerts = alerts.filter(facility_id=facility_id)

        severity = request.query_params.get('severity')
        if severity and severity.lower() != 'all':
            alerts = alerts.filter(severity__iexact=severity)

        status_param = request.query_params.get('status')
        if status_param and status_param.lower() != 'all':
            alerts = alerts.filter(status__iexact=status_param)

        serializer = AlertSerializer(alerts, many=True)
        return api_response(data=serializer.data)

    elif request.method == 'POST':
        if not request.user or not request.user.is_authenticated:
            return api_error(message="Authentication required.", status_code=status.HTTP_401_UNAUTHORIZED)
        if getattr(request.user, 'role', None) not in {'Admin', 'Facility Manager'}:
            return api_error(message="You do not have permission to manage alerts.", status_code=status.HTTP_403_FORBIDDEN)

        data = request.data.copy()
        # Aliases mapping
        if 'facilityId' in data and 'facility' not in data:
            data['facility'] = data['facilityId']
        if 'description' in data and 'message' not in data:
            data['message'] = data['description']
        if 'currentValue' in data and 'current_value' not in data:
            data['current_value'] = data['currentValue']
        if 'thresholdValue' in data and 'threshold_value' not in data:
            data['threshold_value'] = data['thresholdValue']

        serializer = AlertSerializer(data=data)
        if serializer.is_valid():
            alert = serializer.save()
            return api_response(
                data=AlertSerializer(alert).data,
                message="Telemetry incident logged.",
                status_code=status.HTTP_201_CREATED,
            )
        return api_error(message="Invalid alert data.", errors=serializer.errors)

@api_view(['GET', 'PUT'])
@permission_classes([IsAdminOrFacilityManagerOrReadOnly])
def alert_detail(request, pk):
    """
    GET /api/alerts/<id>/ - View alert details.
    PUT /api/alerts/<id>/ - Acknowledge or resolve an alert.
    """
    try:
        alert = Alert.objects.get(pk=pk)
    except Alert.DoesNotExist:
        return api_error(message=f"Alert '{pk}' not found.", status_code=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        return api_response(data=AlertSerializer(alert).data)

    elif request.method == 'PUT':
        if not request.user or not request.user.is_authenticated:
            return api_error(message="Authentication required.", status_code=status.HTTP_401_UNAUTHORIZED)
        if getattr(request.user, 'role', None) not in {'Admin', 'Facility Manager'}:
            return api_error(message="You do not have permission to update alerts.", status_code=status.HTTP_403_FORBIDDEN)

        new_status = request.data.get('status')
        if new_status:
            alert.status = new_status
            if new_status.lower() == 'resolved':
                alert.resolved_at = timezone.now()
            alert.save(update_fields=['status', 'resolved_at'])

        return api_response(
            data=AlertSerializer(alert).data,
            message=f"Incident '{alert.title}' status updated to {alert.status}.",
        )

@api_view(['POST'])
@permission_classes([IsAdminOrFacilityManagerOrReadOnly])
def trigger_test_alert(request):
    """
    POST /api/alerts/test/ - Simulates an instantaneous spike alert for testing.
    """
    if not request.user or not request.user.is_authenticated:
        return api_error(message="Authentication required.", status_code=status.HTTP_401_UNAUTHORIZED)
    if getattr(request.user, 'role', None) not in {'Admin', 'Facility Manager'}:
        return api_error(message="You do not have permission to trigger alerts.", status_code=status.HTTP_403_FORBIDDEN)

    facility = Facility.objects.first()
    if not facility:
        return api_error(message="No facility available to attach alert to.")

    alert = Alert.objects.create(
        facility=facility,
        title="Sudden Inrush Current Spike",
        alert_type="Transient Inrush Draw",
        metric="Transient Inrush Draw",
        message="Chiller compressor motor #2 started with excessive phase angle current draw.",
        severity="Warning",
        status="Active",
        current_value=f"{round(facility.current_consumption * 1.15, 1)} kW",
        threshold_value=f"{facility.peak_threshold_kw} kW cap",
    )

    return api_response(
        data=AlertSerializer(alert).data,
        message="Test anomaly successfully triggered.",
        status_code=status.HTTP_201_CREATED,
    )

@api_view(['POST'])
@permission_classes([IsAdminOrFacilityManagerOrReadOnly])
def check_energy_rules(request):
    """
    POST /api/alerts/check/
    Rule-based energy consumption monitor:
    Checks all facilities. If current_consumption > peak_threshold_kw or
    exceeds threshold by 10%, an alert is automatically generated.
    """
    if not request.user or not request.user.is_authenticated:
        return api_error(message="Authentication required.", status_code=status.HTTP_401_UNAUTHORIZED)
    if getattr(request.user, 'role', None) not in {'Admin', 'Facility Manager'}:
        return api_error(message="You do not have permission to run alert rules.", status_code=status.HTTP_403_FORBIDDEN)

    facilities = Facility.objects.all()
    created_alerts = []

    for fac in facilities:
        if fac.peak_threshold_kw > 0 and fac.current_consumption > fac.peak_threshold_kw:
            # Check if active alert already exists
            existing = Alert.objects.filter(
                facility=fac,
                alert_type="Peak Overload",
                status='Active'
            ).exists()

            if not existing:
                excess_pct = round(((fac.current_consumption - fac.peak_threshold_kw) / fac.peak_threshold_kw) * 100, 1)
                new_alert = Alert.objects.create(
                    facility=fac,
                    title=f"Peak Demand Exceeded at {fac.name}",
                    alert_type="Peak Overload",
                    metric="Instantaneous Demand",
                    message=f"Instantaneous load of {fac.current_consumption} kW breached contracted cap of {fac.peak_threshold_kw} kW by {excess_pct}%.",
                    severity="Critical" if excess_pct > 10 else "Warning",
                    status="Active",
                    current_value=f"{fac.current_consumption} kW",
                    threshold_value=f"{fac.peak_threshold_kw} kW cap",
                )
                created_alerts.append(AlertSerializer(new_alert).data)

    return api_response(
        data={
            'alerts_created': len(created_alerts),
            'alerts': created_alerts,
        },
        message=f"Rule check completed. {len(created_alerts)} new alerts created.",
    )
