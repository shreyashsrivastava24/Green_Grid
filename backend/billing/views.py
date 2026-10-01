from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework import status
from django.db.models import Sum
from greengrid.utils import api_response, api_error, IsAdminOrFacilityManagerOrReadOnly
from facilities.models import Facility
from .models import Bill
from .serializers import BillSerializer

@api_view(['GET', 'POST'])
@permission_classes([IsAdminOrFacilityManagerOrReadOnly])
def billing_list_create(request):
    """
    GET /api/billing/ - List bills and monthly cost trends.
    POST /api/billing/ - Generate a new utility bill.
    """
    if request.method == 'GET':
        bills = Bill.objects.all()

        facility_id = request.query_params.get('facility_id')
        if facility_id and facility_id.lower() != 'all':
            bills = bills.filter(facility_id=facility_id)

        status_filter = request.query_params.get('status')
        if status_filter and status_filter.lower() != 'all':
            bills = bills.filter(status__iexact=status_filter)

        serializer = BillSerializer(bills, many=True)

        # Monthly cost trend data matching MONTHLY_COST_DATA in frontend
        monthly_trend = [
            {'month': 'Apr', 'gridCost': 980000, 'solarSavings': 285000, 'netCost': 695000, 'budget': 750000},
            {'month': 'May', 'gridCost': 1120000, 'solarSavings': 340000, 'netCost': 780000, 'budget': 800000},
            {'month': 'Jun', 'gridCost': 1240000, 'solarSavings': 310000, 'netCost': 930000, 'budget': 850000},
            {'month': 'Jul', 'gridCost': 1080000, 'solarSavings': 290000, 'netCost': 790000, 'budget': 820000},
            {'month': 'Aug', 'gridCost': 1150000, 'solarSavings': 325000, 'netCost': 825000, 'budget': 840000},
            {'month': 'Sep', 'gridCost': 1142800, 'solarSavings': 368000, 'netCost': 774800, 'budget': 820000},
        ]

        total_billed = sum(b.total_amount for b in bills)
        total_solar_credits = sum(b.solar_credit for b in bills)

        return api_response(data={
            'bills': serializer.data,
            'summary': {
                'totalBilledInr': round(total_billed, 2),
                'totalSolarCreditInr': round(total_solar_credits, 2),
                'activeBillsCount': bills.count(),
            },
            'monthlyCostTrend': monthly_trend,
        })

    elif request.method == 'POST':
        if not request.user or not request.user.is_authenticated:
            return api_error(message="Authentication required.", status_code=status.HTTP_401_UNAUTHORIZED)
        if getattr(request.user, 'role', None) not in {'Admin', 'Facility Manager'}:
            return api_error(message="You do not have permission to create utility bills.", status_code=status.HTTP_403_FORBIDDEN)

        data = request.data.copy()
        # CamelCase mapping
        mapping = {
            'facilityName': 'facility_name',
            'invoiceNo': 'invoice_no',
            'billingPeriod': 'billing_period',
            'dueDate': 'due_date',
            'unitsConsumedKwh': 'units_consumed',
            'solarGeneratedKwh': 'solar_generated_kwh',
            'netBilledUnitsKwh': 'net_billed_units_kwh',
            'baseRatePerKwh': 'tariff',
            'baseEnergyChargesInr': 'base_energy_charges',
            'peakHourSurchargesInr': 'peak_hour_surcharges',
            'fixedDemandChargesInr': 'fixed_demand_charges',
            'solarCreditInr': 'solar_credit',
            'taxesAndDutiesInr': 'taxes_and_duties',
            'totalAmountInr': 'total_amount',
        }
        for camel, snake in mapping.items():
            if camel in data and snake not in data:
                data[snake] = data[camel]

        serializer = BillSerializer(data=data)
        if serializer.is_valid():
            bill = serializer.save()
            return api_response(
                data=BillSerializer(bill).data,
                message="Utility statement generated successfully.",
                status_code=status.HTTP_201_CREATED,
            )
        return api_error(message="Bill creation failed.", errors=serializer.errors)

@api_view(['GET'])
@permission_classes([AllowAny])
def billing_detail_or_facility(request, identifier):
    """
    GET /api/billing/<facility_id>/ or /api/billing/<bill_id>/
    Returns bills for a facility, or a single bill matching the ID.
    """
    # Check if identifier matches a specific bill ID
    bill = Bill.objects.filter(id=identifier).first()
    if bill:
        return api_response(data=BillSerializer(bill).data)

    # Check if identifier matches a facility
    facility_bills = Bill.objects.filter(facility_id=identifier)
    if facility_bills.exists():
        serializer = BillSerializer(facility_bills, many=True)
        return api_response(data=serializer.data)

    return api_error(
        message=f"No bill or facility statements found for identifier '{identifier}'.",
        status_code=status.HTTP_404_NOT_FOUND,
    )
