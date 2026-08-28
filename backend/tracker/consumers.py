import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async

class TrackingConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.delivery_id = self.scope['url_route']['kwargs']['delivery_id']
        self.room_group_name = f'delivery_{self.delivery_id}'

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message_type = data.get('type')

        if message_type == 'location_update':
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'location_message',
                    'latitude': data.get('latitude'),
                    'longitude': data.get('longitude'),
                    'rider_id': data.get('rider_id')
                }
            )
        elif message_type == 'status_update':
            # Broadcast status change to group
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'status_message',
                    'status': data.get('status'),
                    'notes': data.get('notes', '')
                }
            )

    async def location_message(self, event):
        await self.send(text_data=json.dumps({
            'type': 'location_update',
            'latitude': event['latitude'],
            'longitude': event['longitude'],
            'rider_id': event['rider_id']
        }))

    async def status_message(self, event):
        await self.send(text_data=json.dumps({
            'type': 'status_update',
            'status': event['status'],
            'notes': event['notes']
        }))

        