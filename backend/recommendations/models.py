from django.db import models
from facilities.models import Facility
import uuid

class Recommendation(models.Model):
    PRIORITY_CHOICES = (
        ('High', 'High'),
        ('Medium', 'Medium'),
        ('Low', 'Low'),
    )

    CATEGORY_CHOICES = (
        ('Peak Shaving', 'Peak Shaving'),
        ('HVAC Optimization', 'HVAC Optimization'),
        ('Lighting', 'Lighting'),
        ('Solar & Battery', 'Solar & Battery'),
        ('Equipment Schedule', 'Equipment Schedule'),
    )

    EFFORT_CHOICES = (
        ('Immediate (Automated)', 'Immediate (Automated)'),
        ('Low (1-2 days)', 'Low (1-2 days)'),
        ('Medium (1 week)', 'Medium (1 week)'),
        ('High (Hardware)', 'High (Hardware)'),
    )

    id = models.CharField(primary_key=True, max_length=50, editable=True)
    facility = models.ForeignKey(
        Facility,
        on_delete=models.CASCADE,
        related_name='recommendations',
        db_index=True
    )
    facility_name = models.CharField(max_length=200, blank=True)
    title = models.CharField(max_length=255)
    description = models.TextField()
    reason = models.TextField(blank=True, default='')

    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='Medium')
    category = models.CharField(max_length=60, choices=CATEGORY_CHOICES, default='Peak Shaving')
    implementation_effort = models.CharField(max_length=60, choices=EFFORT_CHOICES, default='Immediate (Automated)')

    estimated_energy_saving = models.FloatField(default=0.0, help_text="Estimated savings in kWh")
    estimated_saving_percent = models.FloatField(default=0.0, help_text="Estimated saving percentage")
    estimated_cost_saving = models.FloatField(default=0.0, help_text="Estimated monetary saving in INR")

    is_applied = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-priority', '-estimated_cost_saving']

    def save(self, *args, **kwargs):
        if not self.id:
            self.id = f"rec-{uuid.uuid4().hex[:6]}"
        if self.facility and not self.facility_name:
            self.facility_name = self.facility.name
        super().save(*args, **kwargs)

    def __str__(self):
        return f"[{self.priority}] {self.title} @ {self.facility_name}"
