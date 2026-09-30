from django.db import models
from facilities.models import Facility
import uuid

class Alert(models.Model):
    SEVERITY_CHOICES = (
        ('Critical', 'Critical'),
        ('Warning', 'Warning'),
        ('Info', 'Info'),
    )

    STATUS_CHOICES = (
        ('Active', 'Active'),
        ('Acknowledged', 'Acknowledged'),
        ('Resolved', 'Resolved'),
    )

    id = models.CharField(primary_key=True, max_length=50, editable=True)
    facility = models.ForeignKey(
        Facility,
        on_delete=models.CASCADE,
        related_name='alerts',
        db_index=True
    )
    facility_name = models.CharField(max_length=200, blank=True)
    title = models.CharField(max_length=255)
    alert_type = models.CharField(max_length=100, default='High Energy Consumption')
    metric = models.CharField(max_length=100, default='Instantaneous Demand Draw')
    message = models.TextField(help_text="Detailed engineering diagnostic description")

    severity = models.CharField(max_length=20, choices=SEVERITY_CHOICES, default='Warning')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Active')

    current_value = models.CharField(max_length=100, blank=True, default='')
    threshold_value = models.CharField(max_length=100, blank=True, default='')

    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    resolved_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.id:
            self.id = f"alt-{uuid.uuid4().hex[:6]}"
        if self.facility and not self.facility_name:
            self.facility_name = self.facility.name
        super().save(*args, **kwargs)

    def __str__(self):
        return f"[{self.severity}] {self.title} @ {self.facility_name}"
