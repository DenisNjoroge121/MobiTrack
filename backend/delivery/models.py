import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    ROLE_CHOICES = (
        ('RETAILER', 'Retailer Staff'),
        ('DISPATCHER', 'Dispatcher'),
        ('RIDER', 'Rider'),
    )
    phone = models.CharField(max_length=15, unique=True, null=True, blank=True)
    role = models.CharField(max_length=15, choices=ROLE_CHOICES, default='RETAILER')

    groups = models.ManyToManyField(
        'auth.Group',
        related_name='delivery_user_groups',
        blank=True,
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='delivery_user_permissions',
        blank=True,
    )

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"


class Store(models.Model):
    name = models.CharField(max_length=255)
    address = models.TextField()
    phone = models.CharField(max_length=15)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='stores')

    def __str__(self):
        return self.name


class Delivery(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'Pending Assignment'),
        ('ASSIGNED', 'Assigned to Rider'),
        ('PICKED_UP', 'Picked Up'),
        ('DELIVERED', 'Delivered'),
        ('REJECTED', 'Rejected'),
    )
    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name='deliveries')
    customer_name = models.CharField(max_length=255)
    customer_phone = models.CharField(max_length=15)
    delivery_address = models.TextField()
    item_description = models.TextField()
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='PENDING')
    qr_code_hash = models.CharField(max_length=64, unique=True, default=uuid.uuid4)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Order #{self.id} - {self.status}"


class Assignment(models.Model):
    delivery = models.OneToOneField(Delivery, on_delete=models.CASCADE, related_name='assignment')
    dispatcher = models.ForeignKey(User, on_delete=models.PROTECT, related_name='dispatches_made')
    rider = models.ForeignKey(User, on_delete=models.PROTECT, related_name='assigned_deliveries')
    assigned_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Delivery #{self.delivery.id} -> Rider: {self.rider.username}"