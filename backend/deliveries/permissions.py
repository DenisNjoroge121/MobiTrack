from rest_framework.permissions import BasePermission


class IsRetailer(BasePermission):
    """
    Allows access only to users with the retailer role.
    """

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and hasattr(request.user, 'profile')
            and request.user.profile.role == 'retailer'
        )


class IsDispatcher(BasePermission):
    """
    Allows access only to users with the dispatcher role.
    """

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and hasattr(request.user, 'profile')
            and request.user.profile.role == 'dispatcher'
        )


class IsRider(BasePermission):
    """
    Allows access only to users with the rider role.
    """

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and hasattr(request.user, 'profile')
            and request.user.profile.role == 'rider'
        )