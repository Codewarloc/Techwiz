from rest_framework import serializers
from .models import (
    User, Career, Resource, SuccessStory, UserProfile,
    Multimedia, QuizQuestion, Feedback, Bookmark, QuizResult
)

# User serializer (for registration)
class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = (
            "user_id", "uname", "email", "password", "role",
            "first_name", "last_name"  # <-- add these fields
        )

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User.objects.create_user(password=password, **validated_data)
        return user

# Profiles
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = "__all__"

class CareerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Career
        fields = "__all__"

class ResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource
        fields = "__all__"

class SuccessStorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SuccessStory
        fields = "__all__"

class MultimediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Multimedia
        fields = "__all__"

class QuizQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizQuestion
        fields = "__all__"

        
class QuizResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizResult
        fields = ['result_id', 'user', 'scores', 'best_category', 'submitted_at']
        read_only_fields = ['user', 'result_id', 'submitted_at']

class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = ['feedback_id', 'user', 'category', 'message', 'status', 'submitted_at']
        read_only_fields = ['feedback_id', 'user', 'status', 'submitted_at']

class BookmarkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bookmark
        fields = "__all__"
