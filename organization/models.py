from django.contrib.auth.models import AbstractBaseUser,BaseUserManager, AbstractUser
from base.models import BaseModel
from django.db import models

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, full_name=None, **extra_fields):
        if not email:
            raise ValueError("Email is required")
        email = self.normalize_email(email)
        user = self.model(email=email, full_name=full_name, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, full_name=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email, password, full_name, **extra_fields)

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=15, null=True, blank=True)
    profile_picture = models.ImageField(upload_to='profile_pics/', null=True, blank=True)
    organization = models.ForeignKey('Organization', on_delete=models.SET_NULL, null=True, blank=True)
    department = models.ForeignKey('Department', on_delete=models.SET_NULL, null=True, blank=True)
    location = models.ForeignKey('Location', on_delete=models.SET_NULL, null=True, blank=True)
    designation = models.ForeignKey('Designation', on_delete=models.SET_NULL, null=True, blank=True)
    otp_code = models.CharField(max_length=6, blank=True, null=True)
    otp_created_at = models.DateTimeField(blank=True, null=True)
    receive_emails = models.BooleanField(default=True)
    receive_notifications = models.BooleanField(default=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'  # Email as username for login
    REQUIRED_FIELDS = ['full_name']  # Full name is now required

    def save(self, *args, **kwargs):
        # Split full name into first and last name
        if self.full_name:
            names = self.full_name.split(' ', 1)
            self.first_name = names[0]
            if len(names) > 1:
                self.last_name = names[1]
            else:
                self.last_name = ''
        super().save(*args, **kwargs)

class Organization(BaseModel):
    name = models.CharField(max_length=255, unique=True)
    superusers = models.ManyToManyField('CustomUser',related_name="superuser_organizations")
    employees = models.ManyToManyField('CustomUser', blank=True, related_name="organizations")
    departments = models.ManyToManyField('Department', blank=True, related_name="organizations")
    locations = models.ManyToManyField('Location', blank=True, related_name="organizations")
    designations = models.ManyToManyField('Designation', blank=True, related_name="organizations")
    

class Department(BaseModel):
    name = models.CharField(max_length=255)

class Location(BaseModel):
    name = models.CharField(max_length=255)
    
class Designation(BaseModel):
    title = models.CharField(max_length=255)



