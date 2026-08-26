from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .models import Delivery, Assignment, User
from .serializers import DeliverySerializer, UserSerializer

# Create your views here.

class DeliveryViewSet(viewsets.ModelViewSet):
    queryset = Delivery.objects.all().order_by('-created_at')
    serializer_class = DeliverySerializer

    def perform_create(self, serializer):
        delivery = serializer.save()
        # Broadcast real-time delivery creation event over WebSockets
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            "deliveries",
            {
                "type": "delivery_event",
                "event": "DELIVERY_CREATED",
                "data": DeliverySerializer(delivery).data
            }
        )

    @action(detail=True, methods=['post'])
    def assign(self, request, pk=None):
        delivery = self.get_object()
        rider_id = request.data.get('rider_id')
        dispatcher_id = request.data.get('dispatcher_id')
        
        try:
            rider = User.objects.get(id=rider_id, role='RIDER')
            dispatcher = User.objects.get(id=dispatcher_id)
        except User.DoesNotExist:
            return Response({'error': 'Invalid rider or dispatcher selected'}, status=status.HTTP_400_BAD_REQUEST)

        Assignment.objects.update_or_create(
            delivery=delivery,
            defaults={'dispatcher': dispatcher, 'rider': rider}
        )
        delivery.status = 'ASSIGNED'
        delivery.save()

        # Broadcast real-time assignment update
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            "deliveries",
            {
                "type": "delivery_event",
                "event": "DELIVERY_ASSIGNED",
                "data": DeliverySerializer(delivery).data
            }
        )
        return Response(DeliverySerializer(delivery).data)

    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        delivery = self.get_object()
        new_status = request.data.get('status')
        
        if new_status in dict(Delivery.STATUS_CHOICES):
            delivery.status = new_status
            delivery.save()
            
            # Broadcast state change
            channel_layer = get_channel_layer()
            async_to_sync(channel_layer.group_send)(
                "deliveries",
                {
                    "type": "delivery_event",
                    "event": "STATUS_UPDATED",
                    "data": DeliverySerializer(delivery).data
                }
            )
            return Response(DeliverySerializer(delivery).data)
        return Response({'error': 'Invalid status provided'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def verify_qr(self, request, pk=None):
        delivery = self.get_object()
        scanned_hash = request.data.get('qr_code_hash')

        if delivery.qr_code_hash == scanned_hash:
            delivery.status = 'DELIVERED'
            delivery.save()

            channel_layer = get_channel_layer()
            async_to_sync(channel_layer.group_send)(
                "deliveries",
                {
                    "type": "delivery_event",
                    "event": "STATUS_UPDATED",
                    "data": DeliverySerializer(delivery).data
                }
            )
            return Response({'message': 'Order successfully verified and delivered', 'delivery': DeliverySerializer(delivery).data})
        
        return Response({'error': 'Invalid QR code scan'}, status=status.HTTP_400_BAD_REQUEST)


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    @action(detail=False, methods=['get'])
    def riders(self, request):
        riders = User.objects.filter(role='RIDER')
        return Response(UserSerializer(riders, many=True).data)