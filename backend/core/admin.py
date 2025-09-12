from django.contrib import admin
from .models import (
    User, Career, Resource, SuccessStory, UserProfile,
    Multimedia, QuizQuestion, Feedback, Bookmark, QuizResult, PasswordResetToken
)

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ("user_id", "uname", "email", "role", "is_staff", "created_at")
    list_filter = ("role", "is_staff", "is_active")
    search_fields = ("email", "uname")
    ordering = ("-created_at",)

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ("profile_id", "user", "education_level", "updated_at")
    search_fields = ("user__email", "user__uname")

@admin.register(Career)
class CareerAdmin(admin.ModelAdmin):
    list_display = ("title", "domain", "created_at")
    list_filter = ("domain",)
    search_fields = ("title", "description")

@admin.register(QuizResult)
class QuizResultAdmin(admin.ModelAdmin):
    list_display = ("result_id", "user", "best_category", "submitted_at")
    list_filter = ("best_category",)
    search_fields = ("user__email", "user__uname")
    readonly_fields = ("submitted_at",)

@admin.register(PasswordResetToken)
class PasswordResetTokenAdmin(admin.ModelAdmin):
    list_display = ("user", "created_at", "expires_at")
    search_fields = ("user__email",)

# Register other models with default admin interface
admin.site.register(Resource)
admin.site.register(SuccessStory)
admin.site.register(Multimedia)
admin.site.register(QuizQuestion)
admin.site.register(Feedback)
admin.site.register(Bookmark)    