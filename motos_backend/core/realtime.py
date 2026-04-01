from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

REALTIME_GROUP = "realtime_global"


def broadcast_realtime_event(event_type: str, payload: dict[str, Any] | None = None) -> None:
    channel_layer = get_channel_layer()
    if channel_layer is None:
        return

    async_to_sync(channel_layer.group_send)(
        REALTIME_GROUP,
        {
            "type": "realtime.event",
            "event": {
                "type": str(event_type or "unknown"),
                "payload": payload or {},
                "ts": datetime.now(timezone.utc).isoformat(),
            },
        },
    )
