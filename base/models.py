from django.db import models
from django_lifecycle import LifecycleModel
from simple_history.models import HistoricalRecords


class BaseModel(LifecycleModel, models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    history = HistoricalRecords(inherit=True)
    archived = models.BooleanField(default=False)
    archived_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        abstract = True