from rest_framework import serializers
from .models import (
    User, Career, Resource, SuccessStory, UserProfile,
    Multimedia, QuizQuestion, Feedback, Bookmark, QuizResult, Option
)


# Option Serializer
class OptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Option
        fields = ["id", "text", "category"]


# Quiz Question Serializer
class QuizQuestionSerializer(serializers.ModelSerializer):
    options = OptionSerializer(many=True, read_only=True)

    class Meta:
        model = QuizQuestion
        fields = ["question_id", "text", "order", "options"]


# Quiz Result Serializer
class QuizResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizResult
        fields = ['result_id', 'user', 'scores', 'best_category', 'submitted_at']
        read_only_fields = ['user', 'result_id', 'submitted_at']


# User Serializer
class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = (
            "user_id", "uname", "email", "password", "role",
            "first_name", "last_name"
        )

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User.objects.create_user(password=password, **validated_data)
        return user


# UserProfile Serializer
class UserProfileSerializer(serializers.ModelSerializer):
    education = serializers.JSONField(required=False, default=list)
    work_experience = serializers.JSONField(required=False, default=list)
    skills = serializers.ListField(child=serializers.CharField(), required=False, default=list)
    interests = serializers.ListField(child=serializers.CharField(), required=False, default=list)

    class Meta:
        model = UserProfile
        fields = [
            "id",
            "user",
            "bio",
            "education",
            "work_experience",
            "skills",
            "interests",
        ]
        read_only_fields = ["id", "user"]


# Career Serializer
class CareerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Career
        fields = "__all__"


# Resource Serializer
class ResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource
        fields = "__all__"


# Success Story Serializer
class SuccessStorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SuccessStory
        fields = "__all__"
        read_only_fields = ['user']


# Multimedia Serializer
class MultimediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Multimedia
        fields = "__all__"


# Feedback Serializer
class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = ['feedback_id', 'user', 'category', 'message', 'submitted_at']
        read_only_fields = ['feedback_id', 'user', 'submitted_at']


# Bookmark Serializer
class BookmarkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bookmark
        fields = "__all__"
