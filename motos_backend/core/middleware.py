from __future__ import annotations

import uuid

from .audit import set_current_request_id


class RequestContextMiddleware:
    REQUEST_ID_HEADER = "HTTP_X_REQUEST_ID"

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        request_id = (request.META.get(self.REQUEST_ID_HEADER) or "").strip()
        if not request_id:
            request_id = str(uuid.uuid4())

        set_current_request_id(request_id)
        request.request_id = request_id

        response = self.get_response(request)
        response["X-Request-ID"] = request_id
        return response
