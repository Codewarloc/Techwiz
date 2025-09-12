from django.contrib import admin
from .models import (
    User, Career, Resource, SuccessStory, UserProfile,
    Multimedia, QuizQuestion, Feedback, Bookmark
)

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ("user_id", "uname", "email", "role", "is_staff", "is_superuser")
    search_fields = ("email", "uname")

admin.site.register(Career)
admin.site.register(Resource)
admin.site.register(SuccessStory)
admin.site.register(UserProfile)
admin.site.register(Multimedia)
admin.site.register(QuizQuestion)
admin.site.register(Feedback)
admin.site.register(Bookmark)
