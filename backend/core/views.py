from rest_framework import viewsets, permissions, status, generics, serializers
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from io import BytesIO
from django.http import HttpResponse
import uuid
from django.utils import timezone
from datetime import timedelta
from django.core.mail import send_mail
from django.conf import settings
from django.contrib import admin
from django.contrib.admin.views.decorators import staff_member_required
from django.shortcuts import render
from django.db.models import Count

# PDF export
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet

from .models import (
    User, Career, Resource, SuccessStory, UserProfile,
    Multimedia, QuizQuestion, Feedback, Bookmark,
    QuizResult, PasswordResetToken
)
from .serializers import (
    UserSerializer, CareerSerializer, ResourceSerializer,
    SuccessStorySerializer, UserProfileSerializer,
    MultimediaSerializer, QuizQuestionSerializer,
    FeedbackSerializer, BookmarkSerializer, QuizResultSerializer
)


# -------------------------
# User Views
# -------------------------

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-created_at')
    serializer_class = UserSerializer
    authentication_classes = []

    def get_permissions(self):
        if self.action == 'create':
            self.permission_classes = [permissions.AllowAny]
        else:
            self.authentication_classes = viewsets.ModelViewSet.authentication_classes
            self.permission_classes = [permissions.IsAdminUser]
        return super().get_permissions()


# -------------------------
# Career Views
# -------------------------

class CareerViewSet(viewsets.ModelViewSet):
    queryset = Career.objects.all()
    serializer_class = CareerSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


# -------------------------
# Resource Views
# -------------------------

class ResourceViewSet(viewsets.ModelViewSet):
    queryset = Resource.objects.all().order_by('-created_at')
    serializer_class = ResourceSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    @action(detail=True, methods=['post'])
    def increment_download_count(self, request, pk=None):
        resource = self.get_object()
        resource.download_count += 1
        resource.save()
        return Response({'status': 'success', 'download_count': resource.download_count})


# -------------------------
# Success Story Views
# -------------------------

class SuccessStoryViewSet(viewsets.ModelViewSet):
    serializer_class = SuccessStorySerializer
    
    def get_queryset(self):
        if self.request.user.is_staff:
            return SuccessStory.objects.all().order_by('-created_at')
        return SuccessStory.objects.filter(is_approved=True).order_by('-created_at')

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            self.permission_classes = [permissions.AllowAny]
        else:
            self.permission_classes = [permissions.IsAuthenticated]
        return super().get_permissions()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# -------------------------
# User Profile Views
# -------------------------


class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # allow only user's profiles
        return UserProfile.objects.filter(user=self.request.user)

    @action(detail=False, methods=["get", "patch"], permission_classes=[IsAuthenticated])
    def me(self, request):
        profile, created = UserProfile.objects.get_or_create(user=request.user)

        if request.method == "GET":
            serializer = self.get_serializer(profile)
            return Response(serializer.data)

        # PATCH: partial update
        serializer = self.get_serializer(profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)


# -------------------------
# Multimedia Views
# -------------------------

class MultimediaViewSet(viewsets.ModelViewSet):
    queryset = Multimedia.objects.all()
    serializer_class = MultimediaSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


# -------------------------
# Quiz Views
# -------------------------

class QuizQuestionViewSet(viewsets.ModelViewSet):
    queryset = QuizQuestion.objects.all()
    serializer_class = QuizQuestionSerializer
    permission_classes = [permissions.IsAuthenticated]


class QuizQuestionListAPIView(generics.ListAPIView):
    queryset = QuizQuestion.objects.all()
    serializer_class = QuizQuestionSerializer


class QuizResultViewSet(viewsets.ModelViewSet):
    queryset = QuizResult.objects.all()
    serializer_class = QuizResultSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return QuizResult.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# -------------------------
# Feedback Views
# -------------------------

class FeedbackViewSet(viewsets.ModelViewSet):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        serializer.save(user=user)


# -------------------------
# Bookmark Views
# -------------------------

class BookmarkViewSet(viewsets.ModelViewSet):
    queryset = Bookmark.objects.all() 
    serializer_class = BookmarkSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Bookmark.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=["get"])
    def export_pdf(self, request):
        bookmarks = Bookmark.objects.filter(user=request.user)
        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer)
        styles = getSampleStyleSheet()
        story = []

        story.append(Paragraph("My Bookmarks & Notes", styles["Title"]))
        story.append(Spacer(1, 20))

        for bm in bookmarks:
            item = bm.career or bm.resource or bm.multimedia
            text = f"<b>{item}</b><br/>{bm.note or ''}"
            story.append(Paragraph(text, styles["Normal"]))
            story.append(Spacer(1, 12))

        doc.build(story)
        buffer.seek(0)
        return HttpResponse(
            buffer,
            as_attachment=True,
            content_type="application/pdf",
            headers={"Content-Disposition": 'attachment; filename="bookmarks.pdf"'},
        )


# -------------------------
# Current User API
# -------------------------

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer

@api_view(['GET', 'PATCH'])
@permission_classes([IsAuthenticated])
def current_user(request):
    """
    GET: return current user
    PATCH: allow partial update of simple fields (first_name, last_name)
    """
    if request.method == 'GET':
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    # PATCH
    data = request.data
    user = request.user
    changed = False

    # Only allow these simple fields in this quick patch
    if 'first_name' in data:
        user.first_name = data['first_name']
        changed = True
    if 'last_name' in data:
        user.last_name = data['last_name']
        changed = True

    # If password update is needed, handle separately and securely:
    # if 'password' in data:
    #     user.set_password(data['password'])
    #     changed = True

    if changed:
        user.save()
        serializer = UserSerializer(user)
        return Response(serializer.data)
    else:
        return Response({"detail": "No updatable fields provided."}, status=status.HTTP_400_BAD_REQUEST)

# -------------------------
# Password Reset
# -------------------------

class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()


class PasswordResetRequestView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = PasswordResetRequestSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"detail": "User with this email does not exist."}, status=status.HTTP_404_NOT_FOUND)

        PasswordResetToken.objects.filter(user=user).delete()

        token = uuid.uuid4().hex
        expires_at = timezone.now() + timedelta(hours=1)
        PasswordResetToken.objects.create(user=user, token=token, expires_at=expires_at)

        reset_url = f"{settings.FRONTEND_URL}/reset-password/{token}"
        subject = "Your Password Reset Link for PathSeeker"
        message = (
            f"Hi {user.uname},\n\n"
            f"Please click the link below to reset your password:\n{reset_url}\n\n"
            f"This link will expire in 1 hour.\n\n"
            f"Thanks,\nThe PathSeeker Team"
        )

        try:
            send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [user.email])
            return Response({"detail": "Password reset link sent to your email."})
        except Exception as e:
            return Response({"detail": f"Failed to send email: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class PasswordResetConfirmView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        token = request.data.get('token')
        password = request.data.get('password')

        if not token or not password:
            return Response({"detail": "Token and password are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            reset_token = PasswordResetToken.objects.get(token=token)
        except PasswordResetToken.DoesNotExist:
            return Response({"detail": "Invalid or expired token."}, status=status.HTTP_400_BAD_REQUEST)

        if reset_token.expires_at < timezone.now():
            reset_token.delete()
            return Response({"detail": "Token has expired."}, status=status.HTTP_400_BAD_REQUEST)

        user = reset_token.user
        user.set_password(password)
        user.save()
        reset_token.delete()

        return Response({"detail": "Password has been reset successfully."}, status=status.HTTP_200_OK)


# -------------------------
# Admin Dashboard View
# -------------------------

@staff_member_required
def dashboard_view(request):
    thirty_days_ago = timezone.now() - timedelta(days=30)

    active_user_ids = QuizResult.objects.filter(submitted_at__gte=thirty_days_ago).values_list("user_id", flat=True)
    recent_users = User.objects.filter(created_at__gte=thirty_days_ago).values_list("id", flat=True)
    active_users_count = User.objects.filter(pk__in=set(list(active_user_ids) + list(recent_users))).count()

    quiz_attempts_count = QuizResult.objects.count()
    popular_categories = (
        QuizResult.objects.values("best_category")
        .annotate(count=Count("best_category"))
        .order_by("-count")[:5]
    )

    popular_careers = (
        Bookmark.objects.values("career__title")
        .annotate(count=Count("career"))
        .order_by("-count")[:5]
    )
    popular_resources = (
        Bookmark.objects.values("resource__title")
        .annotate(count=Count("resource"))
        .order_by("-count")[:5]
    )
    popular_multimedia = (
        Bookmark.objects.values("multimedia__title")
        .annotate(count=Count("multimedia"))
        .order_by("-count")[:5]
    )

    context = {
        **admin.site.each_context(request),
        "active_users_count": active_users_count,
        "quiz_attempts_count": quiz_attempts_count,
        "popular_categories": popular_categories,
        "popular_careers": popular_careers,
        "popular_resources": popular_resources,
        "popular_multimedia": popular_multimedia,
        "title": "Dashboard",
    }

    return render(request, "admin/dashboard.html", context)
