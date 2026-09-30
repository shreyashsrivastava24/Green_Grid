from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import exception_handler

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
