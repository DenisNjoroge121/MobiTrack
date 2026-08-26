from rest_framework import serializers
from .models import User, Store, Delivery, Assignment

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'phone', 'role']

class StoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Store
        fields = ['id', 'name', 'address', 'phone', 'owner']

class AssignmentSerializer(serializers.ModelSerializer):
    dispatcher_name = serializers.CharField(source='dispatcher.username', read_only=True)
    rider_name = serializers.CharField(source='rider.username', read_only=True)

    class Meta:
        model = Assignment
        fields = ['id', 'delivery', 'dispatcher', 'dispatcher_name', 'rider', 'rider_name', 'assigned_at']

class DeliverySerializer(serializers.ModelSerializer):
    store_name = serializers.CharField(source='store.name', read_only=True)
    assignment = AssignmentSerializer(read_only=True)

    class Meta:
        model = Delivery
        fields = [
            'id', 'store', 'store_name', 'customer_name', 
            'customer_phone', 'delivery_address', 'item_description', 
            'status', 'qr_code_hash', 'assignment', 'created_at', 'updated_at'
        ]