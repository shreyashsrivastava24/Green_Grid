from django.urls import path
from .views import recommendation_list_create, recommendation_detail, generate_recommendations

urlpatterns = [
    path('', recommendation_list_create, name='recommendation-list-create'),
    path('generate/', generate_recommendations, name='recommendation-generate'),
    path('<str:pk>/', recommendation_detail, name='recommendation-detail'),
]
