from django.contrib.auth.models import AbstractUser
from base.models import BaseModel
from django.db import models

class CustomUser(AbstractUser, BaseModel):
    organization = models.ForeignKey('Organization', on_delete=models.SET_NULL, null=True, blank=True)
    department = models.ForeignKey('Department', on_delete=models.SET_NULL, null=True, blank=True)
    location = models.ForeignKey('Location', on_delete=models.SET_NULL, null=True, blank=True)
    designation = models.ForeignKey('Designation', on_delete=models.SET_NULL, null=True, blank=True)
    profile_picture = models.ImageField(upload_to='profile_pics/', null=True, blank=True)
    phone_number = models.CharField(max_length=15, null=True, blank=True)



class Organization(models.Model):
    name = models.CharField(max_length=255, unique=True)
    employees = models.ManyToManyField('CustomUser', blank=True, related_name="organizations")
    departments = models.ManyToManyField('Department', blank=True, related_name="organizations")
    locations = models.ManyToManyField('Location', blank=True, related_name="organizations")
    designations = models.ManyToManyField('Designation', blank=True, related_name="organizations")
    
    def get_allusers(self):
        return self.employees.all()

class Department(models.Model):
    name = models.CharField(max_length=255)

class Location(models.Model):
    name = models.CharField(max_length=255)
    
class Designation(models.Model):
    title = models.CharField(max_length=255)





