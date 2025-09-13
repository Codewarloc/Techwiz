from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .views import (
    UserViewSet, CareerViewSet, ResourceViewSet, SuccessStoryViewSet,
    UserProfileViewSet, MultimediaViewSet, QuizQuestionViewSet,
    FeedbackViewSet, BookmarkViewSet, QuizResultViewSet, QuizQuestionListAPIView,
    PasswordResetRequestView, PasswordResetConfirmView
)
from .serializers import UserSerializer

# --- Current user view (must be defined first) ---
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def current_user(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)

# --- DRF router setup ---
router = DefaultRouter()
router.register(r"users", UserViewSet)
router.register(r"careers", CareerViewSet)
router.register(r"resources", ResourceViewSet)
router.register(r"profiles", UserProfileViewSet)
router.register(r"multimedia", MultimediaViewSet)
router.register(r"questions", QuizQuestionViewSet)
router.register(r"feedback", FeedbackViewSet)
router.register(r"bookmarks", BookmarkViewSet, basename="bookmark")
router.register(r"quizresults", QuizResultViewSet)
router.register(r"successstories", SuccessStoryViewSet, basename='successstory')

# --- API endpoints ---
urlpatterns = [
    # DRF router URLs
    path("", include(router.urls)),

    # Quiz questions list endpoint (read-only)
    path("questions/list/", QuizQuestionListAPIView.as_view(), name="quiz-question-list"),

    # Current logged-in user endpoint
    path("auth/me/", current_user, name="current_user"),

    # Password reset endpoints
    path("auth/password-reset/", PasswordResetRequestView.as_view(), name="password_reset_request"),
    path("auth/password-reset/confirm/", PasswordResetConfirmView.as_view(), name="password_reset_confirm"),
]
