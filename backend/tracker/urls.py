from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DeliveryViewset, LocationUpdateViewSet

router = DefaultRouter()
router.register(r'deliveries', DeliveryViewset)
router.register(r'locations', LocationUpdateViewSet)

urlpatterns = [
    path('', include(router.urls))
]