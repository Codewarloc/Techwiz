from django.contrib import admin
from .models import (
    User, Career, Resource, SuccessStory, UserProfile,
    Multimedia, QuizQuestion, Feedback, Bookmark, QuizResult, PasswordResetToken, Option
)

class OptionInline(admin.TabularInline):
    model = Option
    extra = 0 


@admin.register(QuizQuestion)
class QuizQuestionAdmin(admin.ModelAdmin):
    list_display = ("text", "order")
    inlines = [OptionInline]
    search_fields = ("text",)

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

@admin.register(SuccessStory)
class SuccessStoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'domain', 'is_approved', 'created_at')
    list_filter = ('is_approved', 'domain')
    list_editable = ('is_approved',)
    search_fields = ('name', 'user__email')
    actions = ['approve_stories']

    def approve_stories(self, request, queryset):
        queryset.update(is_approved=True)
    approve_stories.short_description = "Mark selected stories as approved"

# Register other models with default admin interface
admin.site.register(Resource)
admin.site.register(Multimedia)
admin.site.register(Feedback)
admin.site.register(Bookmark)