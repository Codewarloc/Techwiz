from rest_framework import viewsets, permissions, status, generics, serializers
from rest_framework.decorators import action
from rest_framework.response import Response
import uuid
from django.utils import timezone
from datetime import timedelta
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.admin.views.decorators import staff_member_required
from django.shortcuts import render
from django.db.models import Count

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

# --- ViewSets ---

class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-created_at')
    serializer_class = UserSerializer
    # Add authentication_classes to the viewset
    authentication_classes = [] 

    def get_permissions(self):
        """
        Allow unauthenticated users to create an account (register).
        Otherwise, require admin permissions.
        """
        if self.action == 'create':
            # For 'create' (registration), no permissions are needed.
            self.permission_classes = [permissions.AllowAny]
        else:
            # For all other actions, default to the global authentication and permission scheme.
            # This will re-enable JWT authentication for listing, updating, etc.
            self.authentication_classes = viewsets.ModelViewSet.authentication_classes
            self.permission_classes = [permissions.IsAdminUser]
        return super().get_permissions()


class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


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


class MultimediaViewSet(viewsets.ModelViewSet):
    queryset = Multimedia.objects.all()
    serializer_class = MultimediaSerializer
    permission_classes = [permissions.IsAdminUser]


class QuizQuestionViewSet(viewsets.ModelViewSet):
    queryset = QuizQuestion.objects.all()
    serializer_class = QuizQuestionSerializer
    permission_classes = [permissions.IsAuthenticated]


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


# --- Custom Admin Dashboard View ---

@staff_member_required
def dashboard_view(request):
    # 1. Active Users (users who have submitted a quiz or created in the last 30 days)
    thirty_days_ago = timezone.now() - timedelta(days=30)
    active_user_ids = QuizResult.objects.filter(submitted_at__gte=thirty_days_ago).values_list('user_id', flat=True)
    recent_users = User.objects.filter(created_at__gte=thirty_days_ago).values_list('user_id', flat=True)
    active_users_count = User.objects.filter(pk__in=set(list(active_user_ids) + list(recent_users))).count()

    # 2. Total Quiz Attempts
    quiz_attempts_count = QuizResult.objects.count()

    # 3. Popular Content (most common quiz result categories)
    popular_categories = QuizResult.objects.values('best_category').annotate(count=Count('best_category')).order_by('-count')[:5]

    # 4. Most Bookmarked Careers
    popular_careers = Bookmark.objects.values('career__title').annotate(count=Count('career')).order_by('-count')[:5]

    context = {
        **admin.site.each_context(request),
        'active_users_count': active_users_count,
        'quiz_attempts_count': quiz_attempts_count,
        'popular_categories': popular_categories,
        'popular_careers': popular_careers,
        'title': 'Dashboard'
    }
    return render(request, "admin/dashboard.html", context)
