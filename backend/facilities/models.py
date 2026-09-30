from django.db import models
import uuid

class Facility(models.Model):
    STATUS_CHOICES = (
        ('Normal', 'Normal'),
        ('Attention', 'Attention'),
        ('High Usage', 'High Usage'),
        ('Critical', 'Critical'),
    )

    id = models.CharField(primary_key=True, max_length=50, editable=True)
    name = models.CharField(max_length=200, db_index=True)
    location = models.CharField(max_length=255)
    type = models.CharField(max_length=120, default='Commercial Tech Campus')

    # Consumption & Financial Metrics
    current_consumption = models.FloatField(default=0.0, help_text="Instantaneous demand in kW")
    monthly_consumption = models.FloatField(default=0.0, help_text="Accumulated monthly consumption in kWh")
    estimated_cost = models.FloatField(default=0.0, help_text="Estimated monthly billing cost in INR")
    renewable_percentage = models.FloatField(default=0.0, help_text="Solar/Renewable energy offset %")
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='Normal')

    # Grid & Physical Characteristics
    solar_capacity_kwp = models.FloatField(default=0.0, help_text="Installed solar rooftop capacity in kWp")
    peak_threshold_kw = models.FloatField(default=0.0, help_text="Sanctioned contractual peak demand limit in kW")
    peak_usage_window = models.CharField(max_length=60, default='14:00 – 17:30')
    grid_share_percent = models.FloatField(default=70.0)
    floor_area_sq_ft = models.FloatField(default=100000.0)
    monthly_savings_inr = models.FloatField(default=0.0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Facilities"
        ordering = ['name']

    def save(self, *args, **kwargs):
        if not self.id:
            slug = self.name.lower()[:3] if self.name else 'fac'
            self.id = f"fac-{slug}-{uuid.uuid4().hex[:6]}"
        if not self.grid_share_percent and self.renewable_percentage:
            self.grid_share_percent = max(0.0, 100.0 - self.renewable_percentage)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} ({self.location})"
