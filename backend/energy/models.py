from django.db import models
from facilities.models import Facility

class EnergyReading(models.Model):
    INTERVAL_CHOICES = (
        ('hourly', 'Hourly'),
        ('daily', 'Daily'),
        ('monthly', 'Monthly'),
    )

    facility = models.ForeignKey(
        Facility,
        on_delete=models.CASCADE,
        related_name='readings',
        db_index=True
    )
    timestamp = models.DateTimeField(db_index=True)
    date = models.DateField(db_index=True)
    interval = models.CharField(max_length=20, choices=INTERVAL_CHOICES, default='hourly')
    time_label = models.CharField(max_length=50, blank=True, help_text="e.g. '14:00', 'Mon', 'Apr'")

    consumption_kwh = models.FloatField(help_text="Total energy consumed (kWh)")
    grid_consumption_kwh = models.FloatField(help_text="Energy pulled from utility grid (kWh)")
    solar_generation_kwh = models.FloatField(default=0.0, help_text="Solar/Clean energy generated (kWh)")
    cost = models.FloatField(default=0.0, help_text="Calculated cost in INR")

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['timestamp']
        indexes = [
            models.Index(fields=['facility', 'date']),
            models.Index(fields=['facility', 'timestamp']),
            models.Index(fields=['interval', 'timestamp']),
        ]

    def save(self, *args, **kwargs):
        if not self.date and self.timestamp:
            self.date = self.timestamp.date()
        if not self.cost and self.grid_consumption_kwh:
            # Baseline tariff: ~₹7.5/kWh off-peak, ~₹8.5/kWh peak
            self.cost = round(self.grid_consumption_kwh * 7.5, 2)
        if not self.consumption_kwh:
            self.consumption_kwh = round(self.grid_consumption_kwh + self.solar_generation_kwh, 2)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.facility.name} @ {self.timestamp} - {self.consumption_kwh} kWh"
