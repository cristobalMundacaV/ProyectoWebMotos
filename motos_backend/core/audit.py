from __future__ import annotations

from contextvars import ContextVar
from datetime import date, datetime, time
from decimal import Decimal
from uuid import UUID

from django.contrib.auth import get_user_model
from django.db.models import Model


_request_id_ctx: ContextVar[str] = ContextVar("request_id", default="")


def set_current_request_id(request_id: str) -> None:
    _request_id_ctx.set(str(request_id or "").strip())


def get_current_request_id() -> str:
    return _request_id_ctx.get("")


def _to_json_value(value):
    if value is None:
        return None
    if isinstance(value, (str, int, float, bool)):
        return value
    if isinstance(value, Decimal):
        return str(value)
    if isinstance(value, (datetime, date, time)):
        return value.isoformat()
    if isinstance(value, UUID):
        return str(value)
    if isinstance(value, (list, tuple)):
        return [_to_json_value(item) for item in value]
    if isinstance(value, dict):
        return {str(k): _to_json_value(v) for k, v in value.items()}
    return str(value)


def serialize_instance_for_audit(instance: Model) -> dict:
    if not instance:
        return {}

    data = {}
    for field in instance._meta.concrete_fields:
        raw_value = getattr(instance, field.attname, None)
        data[field.name] = _to_json_value(raw_value)
    data["id"] = _to_json_value(getattr(instance, "pk", None))
    return data


def build_request_metadata(request) -> dict:
    if request is None:
        return {}
    return {
        "method": getattr(request, "method", ""),
        "path": getattr(request, "path", ""),
        "query_string": request.META.get("QUERY_STRING", ""),
        "remote_addr": request.META.get("REMOTE_ADDR", ""),
        "user_agent": request.META.get("HTTP_USER_AGENT", ""),
    }


def create_audit_log(
    *,
    action: str,
    entity: str,
    entity_id,
    before: dict | None = None,
    after: dict | None = None,
    actor=None,
    request_id: str | None = None,
    metadata: dict | None = None,
) -> None:
    from .models import AuditLog

    actor_id = None
    if actor is not None:
        User = get_user_model()
        if isinstance(actor, User):
            actor_id = actor.pk
        else:
            actor_id = actor

    rid = (request_id or get_current_request_id() or "").strip()
    if not rid:
        rid = "system"

    AuditLog.objects.create(
        request_id=rid,
        actor_id=actor_id,
        entidad=str(entity or ""),
        entidad_id=str(entity_id or ""),
        accion=action,
        before=before if before is not None else None,
        after=after if after is not None else None,
        metadata=metadata or {},
    )
