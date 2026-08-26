import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from delivery.models import User, Store

def seed_data():
    print("Seeding database...")

    # Create Retailer User & Store
    retailer, _ = User.objects.get_or_create(
        username='retailer1',
        defaults={'role': 'RETAILER', 'phone': '+254700000001'}
    )
    if _:
        retailer.set_password('password123')
        retailer.save()

    store, _ = Store.objects.get_or_create(
        id=1,
        defaults={'name': 'Nairobi Superstore', 'address': 'CBD, Kimathi Street', 'phone': '+254700000000', 'owner': retailer}
    )

    # Create Dispatcher User
    dispatcher, _ = User.objects.get_or_create(
        username='dispatcher1',
        defaults={'role': 'DISPATCHER', 'phone': '+254700000002'}
    )
    if _:
        dispatcher.set_password('password123')
        dispatcher.save()

    # Create Rider Users
    rider1, _ = User.objects.get_or_create(
        username='rider_kamau',
        defaults={'role': 'RIDER', 'phone': '+254711111111'}
    )
    if _:
        rider1.set_password('password123')
        rider1.save()

    rider2, _ = User.objects.get_or_create(
        username='rider_otieno',
        defaults={'role': 'RIDER', 'phone': '+254722222222'}
    )
    if _:
        rider2.set_password('password123')
        rider2.save()

    print("Database successfully seeded!")
    print("Created Store ID: 1 (Nairobi Superstore)")
    print("Created Riders: rider_kamau, rider_otieno")

if __name__ == '__main__':
    seed_data()