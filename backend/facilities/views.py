from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework import status
from django.db.models import Q
from greengrid.utils import api_response, api_error, IsAdminOrFacilityManagerOrReadOnly
from .models import Facility
from .serializers import FacilitySerializer

@api_view(['GET', 'POST'])
@permission_classes([IsAdminOrFacilityManagerOrReadOnly])
def facility_list_create(request):
    """
    GET /api/facilities/ - List all facilities with optional search/filtering.
    POST /api/facilities/ - Register a new facility.
    """
    if request.method == 'GET':
        queryset = Facility.objects.all()

        # Query search (name or location or type)
        query = request.query_params.get('q', '').strip()
        if query:
            queryset = queryset.filter(
                Q(name__icontains=query) |
                Q(location__icontains=query) |
                Q(type__icontains=query)
            )

        # Status filter
        status_filter = request.query_params.get('status', '').strip()
        if status_filter and status_filter.lower() != 'all':
            queryset = queryset.filter(status__iexact=status_filter)

        serializer = FacilitySerializer(queryset, many=True)
        return api_response(data=serializer.data)

    elif request.method == 'POST':
        if not request.user or not request.user.is_authenticated:
            return api_error(message="Authentication required.", status_code=status.HTTP_401_UNAUTHORIZED)
        if getattr(request.user, 'role', None) not in {'Admin', 'Facility Manager'}:
            return api_error(message="You do not have permission to manage facilities.", status_code=status.HTTP_403_FORBIDDEN)

        data = request.data.copy()
        # Map camelCase to snake_case if incoming
        mapping = {
            'currentConsumptionKw': 'current_consumption',
            'monthlyConsumptionKwh': 'monthly_consumption',
            'estimatedCostInr': 'estimated_cost',
            'renewableSharePercent': 'renewable_percentage',
            'renewablePercentage': 'renewable_percentage',
            'solarCapacityKwp': 'solar_capacity_kwp',
            'peakThresholdKw': 'peak_threshold_kw',
            'peakUsageWindow': 'peak_usage_window',
            'gridSharePercent': 'grid_share_percent',
            'floorAreaSqFt': 'floor_area_sq_ft',
            'monthlySavingsInr': 'monthly_savings_inr',
        }
        for camel, snake in mapping.items():
            if camel in data and snake not in data:
                data[snake] = data[camel]

        serializer = FacilitySerializer(data=data)
        if serializer.is_valid():
            facility = serializer.save()
            return api_response(
                data=FacilitySerializer(facility).data,
                message=f"Facility '{facility.name}' enrolled successfully.",
                status_code=status.HTTP_201_CREATED,
            )
        return api_error(message="Facility creation failed.", errors=serializer.errors)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAdminOrFacilityManagerOrReadOnly])
def facility_detail(request, pk):
    """
    GET /api/facilities/<id>/ - Retrieve a facility by ID.
    PUT /api/facilities/<id>/ - Update facility details.
    DELETE /api/facilities/<id>/ - De-provision a facility.
    """
    try:
        facility = Facility.objects.get(pk=pk)
    except Facility.DoesNotExist:
        return api_error(
            message=f"Facility with id '{pk}' not found.",
            status_code=status.HTTP_404_NOT_FOUND,
        )

    if request.method == 'GET':
        return api_response(data=FacilitySerializer(facility).data)

    elif request.method == 'PUT':
        if not request.user or not request.user.is_authenticated:
            return api_error(message="Authentication required.", status_code=status.HTTP_401_UNAUTHORIZED)
        if getattr(request.user, 'role', None) not in {'Admin', 'Facility Manager'}:
            return api_error(message="You do not have permission to manage facilities.", status_code=status.HTTP_403_FORBIDDEN)

        data = request.data.copy()
        mapping = {
            'currentConsumptionKw': 'current_consumption',
            'monthlyConsumptionKwh': 'monthly_consumption',
            'estimatedCostInr': 'estimated_cost',
            'renewableSharePercent': 'renewable_percentage',
            'renewablePercentage': 'renewable_percentage',
            'solarCapacityKwp': 'solar_capacity_kwp',
            'peakThresholdKw': 'peak_threshold_kw',
            'peakUsageWindow': 'peak_usage_window',
            'gridSharePercent': 'grid_share_percent',
            'floorAreaSqFt': 'floor_area_sq_ft',
            'monthlySavingsInr': 'monthly_savings_inr',
        }
        for camel, snake in mapping.items():
            if camel in data and snake not in data:
                data[snake] = data[camel]

        serializer = FacilitySerializer(facility, data=data, partial=True)
        if serializer.is_valid():
            updated = serializer.save()
            return api_response(
                data=FacilitySerializer(updated).data,
                message=f"Facility '{updated.name}' updated successfully.",
            )
        return api_error(message="Facility update failed.", errors=serializer.errors)

    elif request.method == 'DELETE':
        if not request.user or not request.user.is_authenticated:
            return api_error(message="Authentication required.", status_code=status.HTTP_401_UNAUTHORIZED)
        if getattr(request.user, 'role', None) not in {'Admin', 'Facility Manager'}:
            return api_error(message="You do not have permission to manage facilities.", status_code=status.HTTP_403_FORBIDDEN)

        name = facility.name
        facility.delete()
        return api_response(
            message=f"Facility '{name}' successfully de-provisioned.",
            status_code=status.HTTP_200_OK,
        )
