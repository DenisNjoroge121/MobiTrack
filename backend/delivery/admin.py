from django.contrib import admin
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Store, Delivery, Assignment

# Register your models here.

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ('Role Info', {'fields': ('phone', 'role')}),
    )
    list_display = ['username', 'phone', 'role', 'is_staff']

admin.site.register(Store)
admin.site.register(Delivery)
admin.site.register(Assignment)