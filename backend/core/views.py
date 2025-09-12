from rest_framework import viewsets, permissions, status, generics, serializers
from rest_framework.decorators import action
from rest_framework.response import Response
import uuid
from django.utils import timezone
from datetime import timedelta
from django.core.mail import send_mail
from django.conf import settings

from .models import (
    User, Career, Resource, SuccessStory, UserProfile,
    Multimedia, QuizQuestion, Feedback, Bookmark, QuizResult, PasswordResetToken
)
from .serializers import (
    UserSerializer, CareerSerializer, ResourceSerializer,
    SuccessStorySerializer, UserProfileSerializer,
    MultimediaSerializer, QuizQuestionSerializer,
    FeedbackSerializer, BookmarkSerializer, QuizResultSerializer
)

# -------------------------
# User registration viewset
# -------------------------
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]  # registration open

    def get_permissions(self):
        # Allow anyone to create/register; restrict other actions
        if self.action in ["create"]:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]


# -------------------------
# Career / Resource / etc
# -------------------------
class CareerViewSet(viewsets.ModelViewSet):
    queryset = Career.objects.all()
    serializer_class = CareerSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class ResourceViewSet(viewsets.ModelViewSet):
    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class SuccessStoryViewSet(viewsets.ModelViewSet):
    queryset = SuccessStory.objects.all()
    serializer_class = SuccessStorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class MultimediaViewSet(viewsets.ModelViewSet):
    queryset = Multimedia.objects.all()
    serializer_class = MultimediaSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class QuizQuestionViewSet(viewsets.ModelViewSet):
    queryset = QuizQuestion.objects.all()
    serializer_class = QuizQuestionSerializer
    permission_classes = [permissions.IsAdminUser]


class QuizResultViewSet(viewsets.ModelViewSet):
    queryset = QuizResult.objects.all()
    serializer_class = QuizResultSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # ✅ Only return results for the logged-in user
        return QuizResult.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # ✅ Attach the logged-in user automatically
        serializer.save(user=self.request.user)


class FeedbackViewSet(viewsets.ModelViewSet):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(
            user=self.request.user if self.request.user.is_authenticated else None
        )


class BookmarkViewSet(viewsets.ModelViewSet):
    queryset = Bookmark.objects.all()
    serializer_class = BookmarkSerializer
    permission_classes = [permissions.IsAuthenticated]


# -------------------------
# Password Reset
# -------------------------
class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()


class PasswordResetRequestView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = PasswordResetRequestSerializer

    def post(self, request, *args, **kwargs):
        # Validate email input
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]

        # Check if user exists
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {"detail": "User with this email does not exist."},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Delete any existing tokens for this user
        PasswordResetToken.objects.filter(user=user).delete()

        # Create new token
        token = uuid.uuid4().hex
        expires_at = timezone.now() + timedelta(hours=1)  # Token valid for 1 hour
        PasswordResetToken.objects.create(user=user, token=token, expires_at=expires_at)

        # Build reset link
        reset_url = f"{settings.FRONTEND_URL}/reset-password/{token}"

        subject = "Your Password Reset Link for PathSeeker"
        message = (
            f"Hi {user.uname},\n\n"
            f"Please click the link below to reset your password:\n{reset_url}\n\n"
            f"This link will expire in 1 hour.\n\n"
            f"Thanks,\nThe PathSeeker Team"
        )

        # Try sending email
        try:
            send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [user.email])
            return Response(
                {"detail": "Password reset link sent to your email."},
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return Response(
                {"detail": f"Failed to send email: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class PasswordResetConfirmView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        token = request.data.get("token")
        password = request.data.get("password")

        if not token or not password:
            return Response(
                {"detail": "Token and password are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            reset_token = PasswordResetToken.objects.get(token=token)
        except PasswordResetToken.DoesNotExist:
            return Response(
                {"detail": "Invalid or expired token."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if reset_token.expires_at < timezone.now():
            reset_token.delete()
            return Response(
                {"detail": "Token has expired."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = reset_token.user
        user.set_password(password)
        user.save()

        # Invalidate the token after use
        reset_token.delete()

        return Response(
            {"detail": "Password has been reset successfully."},
            status=status.HTTP_200_OK,
        )
