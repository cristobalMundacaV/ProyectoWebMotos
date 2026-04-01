from channels.generic.websocket import AsyncJsonWebsocketConsumer

from .realtime import REALTIME_GROUP


class RealtimeConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add(REALTIME_GROUP, self.channel_name)
        await self.accept()
        await self.send_json({"type": "connection_ready", "payload": {"channel": "realtime"}})

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(REALTIME_GROUP, self.channel_name)

    async def receive_json(self, content, **kwargs):
        message_type = str((content or {}).get("type") or "").strip().lower()
        if message_type == "ping":
            await self.send_json({"type": "pong"})

    async def realtime_event(self, event):
        await self.send_json(event.get("event") or {})
