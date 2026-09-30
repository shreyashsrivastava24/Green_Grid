from django.db import models
from facilities.models import Facility
import uuid

class Bill(models.Model):
    STATUS_CHOICES = (
        ('Paid', 'Paid'),
        ('Due', 'Due'),
        ('Overdue', 'Overdue'),
        ('Pending', 'Pending'),
    )

    id = models.CharField(primary_key=True, max_length=50, editable=True)
    facility = models.ForeignKey(
        Facility,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='bills'
    )
    facility_name = models.CharField(max_length=200, default='Apex Consolidated Facilities')
    invoice_no = models.CharField(max_length=100, unique=True, db_index=True)
    billing_period = models.CharField(max_length=120, help_text="e.g. '01 Sep 2026 – 30 Sep 2026'")
    due_date = models.CharField(max_length=60, help_text="e.g. '15 Oct 2026'")

    units_consumed = models.FloatField(help_text="Gross electricity consumed in kWh")
    solar_generated_kwh = models.FloatField(default=0.0, help_text="Solar units fed or self-consumed in kWh")
    net_billed_units_kwh = models.FloatField(default=0.0, help_text="Net chargeable units")

    tariff = models.FloatField(default=7.5, help_text="Base tariff rate per kWh in INR")
    base_energy_charges = models.FloatField(default=0.0)
    peak_hour_surcharges = models.FloatField(default=0.0)
    fixed_demand_charges = models.FloatField(default=0.0)
    solar_credit = models.FloatField(default=0.0)
    taxes_and_duties = models.FloatField(default=0.0)
    total_amount = models.FloatField(default=0.0, help_text="Final payable amount in INR")

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Due')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.id:
            self.id = f"bill-{uuid.uuid4().hex[:8]}"

        if not self.net_billed_units_kwh:
            self.net_billed_units_kwh = max(0.0, round(self.units_consumed - self.solar_generated_kwh, 2))

        if not self.base_energy_charges:
            self.base_energy_charges = round(self.net_billed_units_kwh * self.tariff, 2)

        if not self.total_amount:
            # units consumed × electricity tariff + fixed charges - solar credit + taxes
            self.total_amount = round(
                self.base_energy_charges +
                self.peak_hour_surcharges +
                self.fixed_demand_charges +
                self.taxes_and_duties -
                self.solar_credit,
                2
            )

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.invoice_no} ({self.facility_name}) - ₹{self.total_amount}"
