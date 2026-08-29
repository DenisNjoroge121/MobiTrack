from rest_framework import serializers
from .models import Customer, Delivery, DeliveryStatusHistory
from users.models import UserProfile


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ['id', 'name', 'phone', 'address']


class DeliveryStatusHistorySerializer(serializers.ModelSerializer):
    changed_by_name = serializers.SerializerMethodField()

    class Meta:
        model = DeliveryStatusHistory
        fields = [
            'id',
            'status',
            'changed_by',
            'changed_by_name',
            'timestamp',
        ]

    def get_changed_by_name(self, obj):
        if obj.changed_by:
            return obj.changed_by.username
        return None


class DeliverySerializer(serializers.ModelSerializer):
    customer_details = CustomerSerializer(
        source='customer',
        read_only=True
    )

    retailer_name = serializers.CharField(
        source='retailer.username',
        read_only=True
    )

    dispatcher_name = serializers.CharField(
        source='dispatcher.username',
        read_only=True
    )

    rider_name = serializers.CharField(
        source='rider.username',
        read_only=True
    )

    status_display = serializers.CharField(
        source='get_status_display',
        read_only=True
    )

    history = DeliveryStatusHistorySerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = Delivery
        fields = [
            'id',
            'order_number',
            'customer',
            'customer_details',
            'retailer',
            'retailer_name',
            'dispatcher',
            'dispatcher_name',
            'rider',
            'rider_name',
            'pickup_location',
            'delivery_address',
            'description',
            'status',
            'status_display',
            'created_at',
            'updated_at',
            'history',
        ]

        read_only_fields = [
            'retailer',
            'dispatcher',
            'rider',
            'status',
        ]


class RiderSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        source='user.username',
        read_only=True
    )

    email = serializers.EmailField(
        source='user.email',
        read_only=True
    )

    class Meta:
        model = UserProfile
        fields = [
            'id',
            'user',
            'username',
            'email',
            'role',
            'availability',
        ]