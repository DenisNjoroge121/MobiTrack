from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Delivery, DeliveryLog, LocationUpdate
from .serializers import DeliverySerializer, DeliveryLogSerializer, LocationUpdateSerializer

# Create your views here.

class DeliveryViewset(viewsets.ModelViewSet):
    query = Delivery.objects.all().order_by('-created_at')
    serializer_class = DeliverySerializer

    @action(detail=True, methods=['Patch'])
    def update_status(self, request, pk=None):
        delivery = self.get_object()
        new_status = request.data.get('status')

        if new_status:
            delivery.status = new_status
            delivery.save()

            DeliveryLog.objects.create(
                delivery=delivery,
                status=new_status,
                notes=request.data.get('notes', '')
            )
            return Response(DeliverySerializer(delivery).data)
        return Response({'error': 'Status is required'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def assign_rider(self, request, pk=None):
        delivery = self.get_object()
        rider_id = request.data.get('rider_id')
        delivery.rider_id = rider_id
        delivery.status = 'ASSIGNED'
        delivery.save()

        DeliveryLog.objects.create(delivery=delivery, status='ASSIGNED', notes=f"Assigned to rider {rider_id}")
        return Response(DeliverySerializer(delivery).data)

class LocationUpdateViewSet(viewsets.ModelViewSet):
    queryset = LocationUpdate.objects.all().order_by('-timestamp')
    serializer_class = LocationUpdateSerializer
