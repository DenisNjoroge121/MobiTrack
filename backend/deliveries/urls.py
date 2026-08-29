from rest_framework.routers import DefaultRouter

from .views import (
    CustomerViewSet,
    DeliveryViewSet,
    RiderViewSet,
)

router = DefaultRouter()

router.register(
    r'deliveries',
    DeliveryViewSet,
    basename='delivery'
)

router.register(
    r'customers',
    CustomerViewSet,
    basename='customer'
)

router.register(
    r'riders',
    RiderViewSet,
    basename='rider'
)

urlpatterns = router.urls