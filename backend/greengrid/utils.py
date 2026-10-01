from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import BasePermission, SAFE_METHODS
from rest_framework.views import exception_handler
from rest_framework.exceptions import AuthenticationFailed, PermissionDenied


class IsAdminOrFacilityManager(BasePermission):
    """Restrict writes to Admin and Facility Manager roles."""
    message = "Only Admin or Facility Manager users can perform this action."

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            raise AuthenticationFailed('Authentication required.')

        if getattr(request.user, 'role', None) not in {'Admin', 'Facility Manager'}:
            raise PermissionDenied(self.message)

        return True


class IsAdminOrFacilityManagerOrReadOnly(IsAdminOrFacilityManager):
    """Allow safe reads publicly, but restrict mutation endpoints to authorized roles."""

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return super().has_permission(request, view)


def api_response(data=None, message="Success", status_code=status.HTTP_200_OK, success=True):
    """
    Standard GreenGrid API success response format:
    {
        "success": true,
        "message": "...",
        "data": { ... }
    }
    """
    payload = {
        "success": success,
        "message": message,
        "data": data if data is not None else {}
    }
    return Response(payload, status=status_code)

def api_error(message="An error occurred", status_code=status.HTTP_400_BAD_REQUEST, errors=None):
    """
    Standard GreenGrid API error response format:
    {
        "success": false,
        "message": "Meaningful error message",
        "errors": ...
    }
    """
    payload = {
        "success": False,
        "message": message
    }
    if errors is not None:
        payload["errors"] = errors
    return Response(payload, status=status_code)

def custom_exception_handler(exc, context):
    """
    DRF custom exception handler ensuring all errors follow the GreenGrid schema.
    """
    response = exception_handler(exc, context)
    if response is not None:
        msg = "An error occurred"
        if isinstance(response.data, dict):
            if 'detail' in response.data:
                msg = str(response.data['detail'])
            else:
                # Get the first error string
                first_key = next(iter(response.data))
                val = response.data[first_key]
                if isinstance(val, list) and len(val) > 0:
                    msg = f"{first_key}: {val[0]}"
                else:
                    msg = f"{first_key}: {val}"
        elif isinstance(response.data, list) and len(response.data) > 0:
            msg = str(response.data[0])

        response.data = {
            "success": False,
            "message": msg,
            "errors": response.data
        }
    return response
