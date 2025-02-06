from django.db import models
from django.utils.timezone import now
from django.conf import settings
from tasks.models import WorkItem
from organization.models import Designation

class LoginDetails(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="login_details")
    login_time = models.DateTimeField(default=now)
    logout_time = models.DateTimeField(null=True, blank=True)
    workitems = models.ForeignKey(WorkItem, null=True, blank=True, on_delete=models.SET_NULL, related_name="login_sessions")
    date = models.DateField(auto_now_add=True)
    note = models.TextField(blank=True, null=True)

    device_info = models.CharField(max_length=255, blank=True, null=True)  # Stores device/browser info
    ip_address = models.GenericIPAddressField(blank=True, null=True)  # Logs user IP


class LeavePermission(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="leave_permissions")
    start_datetime = models.DateTimeField()
    end_datetime = models.DateTimeField()
    reason = models.TextField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')

    applied_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    approved_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL, related_name="approved_leaves"
    )

    def duration(self):
        """Calculate leave duration in days."""
        return (self.end_datetime - self.start_datetime).days + 1

    @classmethod
    def used_leaves_this_year(cls, user):
        """Get the number of approved leaves for the current year."""
        current_year = now().year
        return cls.objects.filter(
            user=user,
            status="approved",
            start_datetime__year=current_year
        ).aggregate(total=models.Sum(models.F("end_datetime") - models.F("start_datetime")))["total"] or 0

    def __str__(self):
        return f"{self.user.username} - {self.start_datetime} to {self.end_datetime} ({self.status})"



     
class LeavePolicy(models.Model):
    designation = models.OneToOneField(Designation, on_delete=models.CASCADE, related_name="leave_policy")
    max_leaves_per_year = models.PositiveIntegerField(default=20)  # Default 20 days/year

    def __str__(self):
        return f"{self.designation.title} - {self.max_leaves_per_year} days"



