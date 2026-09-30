from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from greengrid.utils import api_response, api_error
from .models import User
from .serializers import UserSerializer, RegisterSerializer, LoginSerializer

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    """Register a new user account."""
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        tokens = get_tokens_for_user(user)
        user_data = UserSerializer(user).data
        return api_response(
            data={
                'user': user_data,
                'tokens': tokens,
            },
            message="User registered successfully.",
            status_code=status.HTTP_201_CREATED,
        )
    return api_error(
        message="Registration validation failed.",
        errors=serializer.errors,
        status_code=status.HTTP_400_BAD_REQUEST,
    )

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """Authenticate with email and password, returning JWT tokens."""
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        tokens = get_tokens_for_user(user)
        user_data = UserSerializer(user).data
        return api_response(
            data={
                'user': user_data,
                'tokens': tokens,
            },
            message="Authentication successful.",
        )
    return api_error(
        message=serializer.errors.get('non_field_errors', ["Invalid login credentials."])[0]
        if 'non_field_errors' in serializer.errors
        else "Invalid credentials provided.",
        errors=serializer.errors,
        status_code=status.HTTP_401_UNAUTHORIZED,
    )

@api_view(['POST'])
@permission_classes([AllowAny])
def demo_login_view(request):
    """Quick demo login for frontend without requiring password re-entry."""
    role = request.data.get('role', 'Admin')
    email = request.data.get('email', 'arjun.s@greengrid.internal')

    user = User.objects.filter(email=email).first()
    if not user:
        user = User.objects.filter(role=role).first()
    if not user:
        user = User.objects.first()

    if not user:
        # Create default demo user on the fly if not seeded yet
        user = User.objects.create_user(
            email='arjun.s@greengrid.internal',
            name='Arjun Swaminathan',
            role='Admin',
            department='Infrastructure & Operations',
            organization='Apex Enterprise Facilities Group',
            phone='+91 98450 12890',
            avatar_url='https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
        )

    tokens = get_tokens_for_user(user)
    return api_response(
        data={
            'user': UserSerializer(user).data,
            'tokens': tokens,
        },
        message="Demo session established.",
    )

@api_view(['POST'])
@permission_classes([AllowAny])
def logout_view(request):
    """Revoke JWT refresh token."""
    refresh_token = request.data.get('refresh')
    if refresh_token:
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
        except Exception:
            pass # Stateless token or blacklist not installed
    return api_response(message="Session ended successfully.")

@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def me_view(request):
    """Retrieve or update current authenticated user profile."""
    user = request.user
    if request.method == 'GET':
        return api_response(data=UserSerializer(user).data)
    elif request.method == 'PUT':
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return api_response(data=serializer.data, message="Profile updated successfully.")
        return api_error(message="Profile update failed.", errors=serializer.errors)
