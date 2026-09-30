from django.contrib import admin
from .models import Recommendation

@admin.register(Recommendation)
class RecommendationAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'facility_name', 'priority', 'category', 'estimated_cost_saving', 'is_applied')
    list_filter = ('priority', 'category', 'is_applied')
    search_fields = ('title', 'facility_name', 'reason')
