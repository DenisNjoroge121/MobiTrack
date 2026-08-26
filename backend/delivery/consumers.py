import json
from channels.generic.websocket import AsyncWebsocketConsumer

class DeliveryConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.group_name = "deliveries"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def delivery_event(self, event):
        await self.send(text_data=json.dumps(event))