from django.urls import path
from .views import billing_list_create, billing_detail_or_facility

urlpatterns = [
    path('', billing_list_create, name='billing-list-create'),
    path('<str:identifier>/', billing_detail_or_facility, name='billing-detail-or-facility'),
]
