from django.urls import path
from .views import facility_list_create, facility_detail

urlpatterns = [
    path('', facility_list_create, name='facility-list-create'),
    path('<str:pk>/', facility_detail, name='facility-detail'),
]
