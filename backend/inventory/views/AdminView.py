from django.contrib.auth import authenticate
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

@api_view(['POST'])
def admin_login(request):
    """
    Handles admin login by validating username and password.

    Expects:
        - JSON body with 'username' and 'password' fields.

    Returns:
        - 200 OK with success message if credentials are valid and user is a superuser.
        - 400 Bad Request if required fields are missing.
        - 401 Unauthorized if credentials are invalid or user lacks admin privileges.
    """
    # Extract credentials from request data
    username = request.data.get('username')
    password = request.data.get('password')

    # Validate input
    if not username or not password:
        return Response(
            {'error': 'Username and password are required'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Attempt to authenticate user
    user = authenticate(request, username=username, password=password)

    # Check if user exists and has superuser privileges
    if user is not None and user.is_superuser:
        return Response(
            {'message': 'Login successful'},
            status=status.HTTP_200_OK
        )

    # Return unauthorized response for invalid credentials or insufficient permissions
    return Response(
        {'error': 'Invalid credentials or not a superuser'},
        status=status.HTTP_401_UNAUTHORIZED
    )
