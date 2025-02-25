
from django.db import models
import uuid
from django.utils import timezone
from datetime import timedelta
from django.conf import settings
from organization.models import Organization

class PendingOTP(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    pending_token = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    otp_secret = models.CharField(max_length=64) 
    created_at = models.DateTimeField(auto_now_add=True)
    raw_otp = models.CharField(max_length=6, null=True, blank=True)  
    
    def is_expired(self):
        return timezone.now() > self.created_at + timedelta(minutes=5)
