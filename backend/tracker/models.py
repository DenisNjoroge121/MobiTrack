from django.db import models
import uuid
from django.contrib.auth.models import User

# Create your models here.
class UserProfile(models.Model):
    ROLE_CHOICES = (
        ('DISPATCHER', 'Dispatcher'),
        ('RIDER', 'Rider'),
        ('CUSTOMER', 'Customer'),
    )
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    phone_number = models.CharField(max_length=15, blank=True)

    def __str__(self):
        return f"{self.user.username} ({self.role})"

class Delivery(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'Pending Assignment'),
        ('ASSIGNED', 'Rider Assigned'),
        ('ACCEPTED', 'Accepted by Rider'),
        ('PICKED_UP', 'Package Picked Up'),
        ('IN_TRANSIT', 'In Transit'),
        ('DELIVERED', 'Delivered'),
        ('CANCELLED', 'Cancelled'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    pickup_address = models.TextField()
    delivery_address = models.TextField()
    
    # Relationships
    dispatcher = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='dispatched_deliveries')
    rider = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_deliveries')
    customer = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='customer_deliveries')
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    verification_code = models.CharField(max_length=6, blank=True, null=True) # OTP / Verification
    signature_image = models.ImageField(upload_to='signatures/', blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Delivery {self.id} - {self.status}"

class DeliveryLog(models.Model):
    delivery = models.ForeignKey(Delivery, on_delete=models.CASCADE, related_name='logs')
    status = models.CharField(max_length=20)
    timestamp = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True)

class LocationUpdate(models.Model):
    delivery = models.ForeignKey(Delivery, on_delete=models.CASCADE, related_name='location_updates')
    rider = models.ForeignKey(User, on_delete=models.CASCADE)
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    timestamp = models.DateTimeField(auto_now_add=True)