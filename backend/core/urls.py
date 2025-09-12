from rest_framework.routers import DefaultRouter
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .views import (
    UserViewSet, CareerViewSet, ResourceViewSet, SuccessStoryViewSet,
    UserProfileViewSet, MultimediaViewSet, QuizQuestionViewSet,
    FeedbackViewSet, BookmarkViewSet,  QuizResultViewSet
)
from .serializers import UserSerializer

router = DefaultRouter()
router.register(r"users", UserViewSet)
router.register(r"careers", CareerViewSet)
router.register(r"resources", ResourceViewSet)
router.register(r"stories", SuccessStoryViewSet)
router.register(r"profiles", UserProfileViewSet)
router.register(r"multimedia", MultimediaViewSet)
router.register(r"questions", QuizQuestionViewSet)
router.register(r"feedback", FeedbackViewSet)
router.register(r"bookmarks", BookmarkViewSet)
router.register(r'quizresults', QuizResultViewSet, basename="quizresults")


urlpatterns = router.urls

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def current_user(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)