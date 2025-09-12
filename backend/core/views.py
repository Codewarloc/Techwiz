from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import (
    User, Career, Resource, SuccessStory, UserProfile,
    Multimedia, QuizQuestion, Feedback, Bookmark, QuizResult
)
from .serializers import (
    UserSerializer, CareerSerializer, ResourceSerializer,
    SuccessStorySerializer, UserProfileSerializer,
    MultimediaSerializer, QuizQuestionSerializer,
    FeedbackSerializer, BookmarkSerializer, QuizResultSerializer
)

# User registration viewset (open)
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]  # registration open; change for list/retrieve in production

    def get_permissions(self):
        # allow anyone to create/register; restrict other actions
        if self.action in ["create"]:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]  # only admin can list/delete users (adjust as needed)

# Career / Resource / etc -- admin can create/edit; public can list/retrieve
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
    permission_classes = [permissions.IsAuthenticated] # Require authentication

    # Automatically attach the logged-in user when creating a quiz result
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class FeedbackViewSet(viewsets.ModelViewSet):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    # Automatically attach the logged-in user when creating feedback
    def perform_create(self, serializer):
        serializer.save(user=self.request.user if self.request.user.is_authenticated else None)

class BookmarkViewSet(viewsets.ModelViewSet):
    queryset = Bookmark.objects.all()
    serializer_class = BookmarkSerializer
    permission_classes = [permissions.IsAuthenticated]
