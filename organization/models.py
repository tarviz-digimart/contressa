from django.db import models
from base.models import BaseModel
from django.conf import settings

class Organization(BaseModel):
    name = models.CharField(max_length=255, unique=True)
    superusers = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name="superuser_organizations")
    employees = models.ManyToManyField(settings.AUTH_USER_MODEL, blank=True, related_name="organizations")

class Location(BaseModel):
    name = models.CharField(max_length=255)
    organization = models.ForeignKey('Organization', on_delete=models.CASCADE, related_name="locations")  

class Branch(BaseModel):
    name = models.CharField(max_length=255)
    location = models.ForeignKey('Location', on_delete=models.CASCADE, related_name="branches")  

class Department(BaseModel):
    name = models.CharField(max_length=255)
    branch = models.ForeignKey('Branch', on_delete=models.CASCADE, related_name="departments")  

class Designation(BaseModel):
    title = models.CharField(max_length=255)
    organization = models.ForeignKey('Organization', on_delete=models.CASCADE, related_name="designations")  
