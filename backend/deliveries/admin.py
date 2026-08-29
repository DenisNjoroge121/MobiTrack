from django.contrib import admin
from .models import Customer, Delivery, DeliveryStatusHistory

# Register your models here.

@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ('name', 'phone', 'address')
    search_fields = ('name', 'phone')


@admin.register(Delivery)
class DeliveryAdmin(admin.ModelAdmin):
    list_display = (
        'order_number',
        'customer',
        'retailer',
        'dispatcher',
        'rider',
        'status',
        'created_at',
    )

    list_filter = ('status',)
    search_fields = (
        'order_number',
        'customer__name',
    )


@admin.register(DeliveryStatusHistory)
class DeliveryStatusHistoryAdmin(admin.ModelAdmin):
    list_display = (
        'delivery',
        'status',
        'changed_by',
        'timestamp',
    )

    list_filter = ('status',)