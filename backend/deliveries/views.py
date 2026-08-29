from django.shortcuts import render
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404

from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny
from .permissions import IsDispatcher, IsRider, IsRetailer
from rest_framework.response import Response

from users.models import UserProfile

from .models import Customer, Delivery, DeliveryStatusHistory
from .serializers import (
    CustomerSerializer,
    DeliverySerializer,
    RiderSerializer,
)

# Create your views here.

class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    permission_classes = [IsAuthenticated]


class DeliveryViewSet(viewsets.ModelViewSet):

    queryset = Delivery.objects.all().select_related(
        'customer',
        'retailer',
        'dispatcher',
        'rider',
    ).prefetch_related('history')

    serializer_class = DeliverySerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.action == 'track_delivery':
            return [AllowAny()]

        if self.action == 'create':
            return [IsRetailer()]

        if self.action in [
            'accept_delivery',
            'reject_delivery',
            'assign_rider'
        ]:
            return [IsDispatcher()]

        if self.action == 'update_status':
            return [IsRider()]

        return [IsAuthenticated()]

    def perform_create(self, serializer):
        delivery = serializer.save(
            retailer=self.request.user,
            status='pending'
        )

        DeliveryStatusHistory.objects.create(
            delivery=delivery,
            status='pending',
            changed_by=self.request.user
        )

    def get_queryset(self):
        user = self.request.user

        if not user.is_authenticated:
            return Delivery.objects.none()

        if hasattr(user, 'profile'):
            role = user.profile.role

            if role == 'retailer':
                return Delivery.objects.filter(
                    retailer=user
                ).select_related(
                    'customer',
                    'retailer',
                    'dispatcher',
                    'rider',
                ).prefetch_related('history')

            if role == 'dispatcher':
                return Delivery.objects.all().select_related(
                    'customer',
                    'retailer',
                    'dispatcher',
                    'rider',
                ).prefetch_related('history')

            if role == 'rider':
                return Delivery.objects.filter(
                    rider=user
                ).select_related(
                    'customer',
                    'retailer',
                    'dispatcher',
                    'rider',
                ).prefetch_related('history')

        return Delivery.objects.none()

    @action(
        detail=False,
        methods=['get'],
        url_path=r'track/(?P<order_number>[^/.]+)',
        permission_classes=[AllowAny]
    )
    def track_delivery(self, request, order_number=None):
        try:
            delivery = Delivery.objects.select_related(
                'customer',
                'rider'
            ).prefetch_related(
                'history'
            ).get(
                order_number=order_number
            )

        except Delivery.DoesNotExist:
            return Response(
                {
                    'error': 'Delivery not found.'
                },
                status=status.HTTP_404_NOT_FOUND
            )

        return Response(
            DeliverySerializer(delivery).data
        )

    @action(
        detail=True,
        methods=['post'],
        url_path='assign'
    )
    def assign_rider(self, request, pk=None):
        delivery = self.get_object()

        rider_id = request.data.get('rider_id')

        if not rider_id:
            return Response(
                {
                    'error': 'rider_id is required.'
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        if delivery.status != 'accepted':
            return Response(
                {
                    'error': 'Only accepted deliveries can be assigned.'
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        rider = get_object_or_404(
            User,
            id=rider_id
        )

        try:
            rider_profile = rider.profile
        except UserProfile.DoesNotExist:
            return Response(
                {
                    'error': 'This user does not have a profile.'
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        if rider_profile.role != 'rider':
            return Response(
                {
                    'error': 'Selected user is not a rider.'
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        if rider_profile.availability != 'available':
            return Response(
                {
                    'error': 'Rider is not available.'
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        delivery.rider = rider
        delivery.status = 'assigned'
        delivery.save()

        rider_profile.availability = 'busy'
        rider_profile.save()

        DeliveryStatusHistory.objects.create(
            delivery=delivery,
            status='assigned',
            changed_by=request.user
        )

        return Response(
            DeliverySerializer(delivery).data
        )

    @action(
    detail=True,
    methods=['post'],
    url_path='status'
    )
    def update_status(self, request, pk=None):
        delivery = self.get_object()

        if delivery.rider != request.user:
            return Response(
                {
                    'error': 'You are not assigned to this delivery.'
                },
                status=status.HTTP_403_FORBIDDEN
            )

        new_status = request.data.get('status')

        allowed_statuses = [
            choice[0]
            for choice in Delivery.STATUS_CHOICES
        ]

        if new_status not in allowed_statuses:
            return Response(
                {
                    'error': 'Invalid status.'
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        valid_transitions = {
            'assigned': ['picked_up'],
            'picked_up': ['in_transit'],
            'in_transit': ['delivered'],
        }

        allowed_next = valid_transitions.get(
            delivery.status,
            []
        )

        if new_status not in allowed_next:
            return Response(
                {
                    'error': (
                        f'Cannot change status from '
                        f'{delivery.status} to {new_status}.'
                    )
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        delivery.status = new_status
        delivery.save()

        DeliveryStatusHistory.objects.create(
            delivery=delivery,
            status=new_status,
            changed_by=request.user
        )

        if new_status == 'delivered' and delivery.rider:
            rider_profile = delivery.rider.profile
            rider_profile.availability = 'available'
            rider_profile.save()

        return Response(
            DeliverySerializer(delivery).data
        )

class RiderViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = UserProfile.objects.filter(
        role='rider'
    ).select_related('user')

    serializer_class = RiderSerializer
    permission_classes = [IsDispatcher]