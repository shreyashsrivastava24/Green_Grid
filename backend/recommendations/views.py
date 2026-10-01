from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework import status
from django.db.models import Sum
from greengrid.utils import api_response, api_error, IsAdminOrFacilityManagerOrReadOnly
from facilities.models import Facility
from .models import Recommendation
from .serializers import RecommendationSerializer

@api_view(['GET', 'POST'])
@permission_classes([IsAdminOrFacilityManagerOrReadOnly])
def recommendation_list_create(request):
    """
    GET /api/recommendations/ - List recommendations with priority/category/facility filter.
    POST /api/recommendations/ - Create new energy-saving recommendation.
    """
    if request.method == 'GET':
        recs = Recommendation.objects.select_related('facility').all()

        facility_id = request.query_params.get('facility_id') or request.query_params.get('facility')
        if facility_id and facility_id.lower() != 'all':
            recs = recs.filter(facility_id=facility_id)

        priority = request.query_params.get('priority')
        if priority and priority.lower() != 'all':
            recs = recs.filter(priority__iexact=priority)

        category = request.query_params.get('category')
        if category and category.lower() != 'all':
            recs = recs.filter(category__iexact=category)

        applied = request.query_params.get('is_applied') or request.query_params.get('isApplied')
        if applied is not None:
            recs = recs.filter(is_applied=str(applied).lower() in ('true', '1'))

        serializer = RecommendationSerializer(recs, many=True)

        # Calculate totals
        total_energy_savings_kwh = recs.aggregate(Sum('estimated_energy_saving'))['estimated_energy_saving__sum'] or 0.0
        total_cost_savings_inr = recs.aggregate(Sum('estimated_cost_saving'))['estimated_cost_saving__sum'] or 0.0

        return api_response(data={
            'recommendations': serializer.data,
            'summary': {
                'totalRecommendations': recs.count(),
                'totalEnergySavingsKwh': round(total_energy_savings_kwh, 2),
                'totalCostSavingsInr': round(total_cost_savings_inr, 2),
            }
        })

    elif request.method == 'POST':
        if not request.user or not request.user.is_authenticated:
            return api_error(message="Authentication required.", status_code=status.HTTP_401_UNAUTHORIZED)
        if getattr(request.user, 'role', None) not in {'Admin', 'Facility Manager'}:
            return api_error(message="You do not have permission to create recommendations.", status_code=status.HTTP_403_FORBIDDEN)

        data = request.data.copy()
        if 'facilityId' in data and 'facility' not in data:
            data['facility'] = data['facilityId']
        if 'estimatedEnergySavingKwh' in data and 'estimated_energy_saving' not in data:
            data['estimated_energy_saving'] = data['estimatedEnergySavingKwh']
        if 'estimatedSavingPercent' in data and 'estimated_saving_percent' not in data:
            data['estimated_saving_percent'] = data['estimatedSavingPercent']
        if 'estimatedCostSavingInr' in data and 'estimated_cost_saving' not in data:
            data['estimated_cost_saving'] = data['estimatedCostSavingInr']
        if 'implementationEffort' in data and 'implementation_effort' not in data:
            data['implementation_effort'] = data['implementationEffort']
        if 'isApplied' in data and 'is_applied' not in data:
            data['is_applied'] = data['isApplied']

        serializer = RecommendationSerializer(data=data)
        if serializer.is_valid():
            rec = serializer.save()
            return api_response(
                data=RecommendationSerializer(rec).data,
                message="Energy conservation measure logged.",
                status_code=status.HTTP_201_CREATED,
            )
        return api_error(message="Invalid recommendation data.", errors=serializer.errors)

@api_view(['GET', 'PUT'])
@permission_classes([IsAdminOrFacilityManagerOrReadOnly])
def recommendation_detail(request, pk):
    """
    GET /api/recommendations/<id>/ - View recommendation.
    PUT /api/recommendations/<id>/ - Toggle application status or update fields.
    """
    try:
        rec = Recommendation.objects.get(pk=pk)
    except Recommendation.DoesNotExist:
        return api_error(message=f"Recommendation '{pk}' not found.", status_code=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        return api_response(data=RecommendationSerializer(rec).data)

    elif request.method == 'PUT':
        if not request.user or not request.user.is_authenticated:
            return api_error(message="Authentication required.", status_code=status.HTTP_401_UNAUTHORIZED)
        if getattr(request.user, 'role', None) not in {'Admin', 'Facility Manager'}:
            return api_error(message="You do not have permission to update recommendations.", status_code=status.HTTP_403_FORBIDDEN)

        is_applied = request.data.get('isApplied')
        if is_applied is None:
            is_applied = request.data.get('is_applied')

        if is_applied is not None:
            rec.is_applied = bool(is_applied)
            rec.save(update_fields=['is_applied'])

        return api_response(
            data=RecommendationSerializer(rec).data,
            message=f"Recommendation '{rec.title}' {'applied' if rec.is_applied else 'reset'} successfully.",
        )

@api_view(['POST'])
@permission_classes([IsAdminOrFacilityManagerOrReadOnly])
def generate_recommendations(request):
    """
    POST /api/recommendations/generate/
    Rule-based energy recommendation engine:
    Evaluates facility consumption, peak hours, and solar penetration to generate actionable measures.
    """
    if not request.user or not request.user.is_authenticated:
        return api_error(message="Authentication required.", status_code=status.HTTP_401_UNAUTHORIZED)
    if getattr(request.user, 'role', None) not in {'Admin', 'Facility Manager'}:
        return api_error(message="You do not have permission to generate recommendations.", status_code=status.HTTP_403_FORBIDDEN)

    facilities = Facility.objects.all()
    created_recs = []

    for fac in facilities:
        # Rule 1: High peak demand vs contracted limit -> Pre-cool thermal mass or load shift
        if fac.current_consumption > (fac.peak_threshold_kw * 0.9):
            if not Recommendation.objects.filter(facility=fac, category='HVAC Optimization').exists():
                r = Recommendation.objects.create(
                    facility=fac,
                    title=f"Pre-cool Thermal Mass Prior to Peak Tariff Window ({fac.name})",
                    category="HVAC Optimization",
                    priority="High",
                    implementation_effort="Immediate (Automated)",
                    estimated_energy_saving=4200.0,
                    estimated_saving_percent=12.5,
                    estimated_cost_saving=33600.0,
                    reason=f"Electricity tariffs rise during peak window {fac.peak_usage_window}. Sub-cooling facility before peak allows chiller throttling.",
                    description="Automate BMS thermostat setpoints to sub-cool zones before peak, then float setpoint to 24°C through peak hours.",
                )
                created_recs.append(RecommendationSerializer(r).data)

        # Rule 2: Low renewable share (< 30%) with solar capacity -> Solar washing & inverter optimization
        if fac.renewable_percentage < 30.0 and fac.solar_capacity_kwp > 50:
            if not Recommendation.objects.filter(facility=fac, category='Solar & Battery').exists():
                r = Recommendation.objects.create(
                    facility=fac,
                    title=f"Automated Solar Panel Wet-Cleaning Schedule ({fac.name})",
                    category="Solar & Battery",
                    priority="Medium",
                    implementation_effort="Immediate (Automated)",
                    estimated_energy_saving=2600.0,
                    estimated_saving_percent=5.8,
                    estimated_cost_saving=20800.0,
                    reason=f"Soiling and dust accumulation at {fac.location} currently limits solar capacity factor.",
                    description="Trigger automated sprinkler or robotic array washing tonight to recover ~85 kWh daily solar yield.",
                )
                created_recs.append(RecommendationSerializer(r).data)

    return api_response(
        data={
            'generated_count': len(created_recs),
            'recommendations': created_recs,
        },
        message=f"Rule engine generated {len(created_recs)} new recommendations.",
    )
