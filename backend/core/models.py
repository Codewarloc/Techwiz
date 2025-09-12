from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser, PermissionsMixin, BaseUserManager
)
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver

class UserManager(BaseUserManager):
    def create_user(self, email, uname=None, password=None, role="student", **extra_fields):
        if not email:
            raise ValueError("Users must have an email address")
        email = self.normalize_email(email)
        user = self.model(email=email, uname=uname or email.split("@")[0], role=role, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, uname=None, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email, uname=uname, password=password, role="admin", **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = [
        ("student", "Student"),
        ("graduate", "Graduate"),
        ("professional", "Professional"),
        ("admin", "Admin"),
    ]

    user_id = models.BigAutoField(primary_key=True)
    uname = models.CharField(max_length=150)
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=150, blank=True, default='John')  # <-- Add this
    last_name = models.CharField(max_length=150, blank=True,  default = 'Doe')   # <-- Add this
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="student")
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)  # access to admin site
    created_at = models.DateTimeField(auto_now_add=True)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["uname"]

    def __str__(self):
        return self.email

# Careers
class Career(models.Model):
    career_id = models.BigAutoField(primary_key=True)
    title = models.CharField(max_length=255)
    description = models.TextField()
    domain = models.CharField(max_length=100)
    required_skills = models.JSONField(default=list, blank=True)  # ["python","sql"]
    education_path = models.TextField(blank=True)
    expected_salary = models.CharField(max_length=100, blank=True)  # or IntegerField with range
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

# Resources
class Resource(models.Model):
    resource_id = models.BigAutoField(primary_key=True)
    title = models.CharField(max_length=255)
    category = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    file = models.FileField(upload_to="resources/", blank=True, null=True)
    file_url = models.URLField(blank=True)  # optional external URL
    tag = models.CharField(max_length=100, blank=True)
    views_count = models.PositiveIntegerField(default=0)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name="resources")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

# Success Stories
class SuccessStory(models.Model):
    story_id = models.BigAutoField(primary_key=True)
    rname = models.CharField(max_length=255)  # real name or role name
    domain = models.CharField(max_length=100)
    story_text = models.TextField()
    image = models.ImageField(upload_to="stories/", blank=True, null=True)
    image_url = models.URLField(blank=True)
    submitted_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name="submitted_stories")
    approved_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name="approved_stories")
    approved_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.rname} ({self.domain})"

# UserProfiles
class UserProfile(models.Model):
    profile_id = models.BigAutoField(primary_key=True)
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="profile")
    education_level = models.CharField(max_length=200, blank=True)
    interests = models.JSONField(default=list, blank=True)  # ["ai","web"]
    skills = models.JSONField(default=list, blank=True)
    profile_image = models.ImageField(upload_to="profiles/", blank=True, null=True)
    resume = models.FileField(upload_to="resumes/", blank=True, null=True)  # optional resume upload
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Profile: {self.user.uname}"

# Multimedia
class Multimedia(models.Model):
    media_id = models.BigAutoField(primary_key=True)
    title = models.CharField(max_length=255)
    type = models.CharField(max_length=50)  # "video", "audio", "article"
    url = models.URLField()
    tags = models.JSONField(default=list, blank=True)
    transcript = models.TextField(blank=True)
    rating_avg = models.FloatField(default=0.0)
    rating_count = models.PositiveIntegerField(default=0)
    uploaded_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name="media")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

# QuizQuestions
class QuizQuestion(models.Model):
    question_id = models.BigAutoField(primary_key=True)
    question_text = models.TextField()
    TYPE_CHOICES = [("mcq", "Multiple Choice"), ("text", "Text"), ("likert", "Likert")]
    type = models.CharField(max_length=20, choices=TYPE_CHOICES, default="mcq")
    options = models.JSONField(default=list, blank=True)  # ["option a","option b"]
    correct_answer = models.JSONField(null=True, blank=True)  # single or list depending on type
    weightage = models.FloatField(default=1.0)

    def __str__(self):
        return self.question_text[:80]

        
class QuizResult(models.Model):
    result_id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE, # Changed from SET_NULL
        related_name="quiz_results"
    )
    scores = models.JSONField()  
    # Example: {"Tech": 2, "Creative": 1, "Analytical": 0, "Leadership": 1}
    
    best_category = models.CharField(max_length=100)
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Result {self.result_id} - {self.best_category}"

# Feedback
class Feedback(models.Model):
    feedback_id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="feedbacks"
    )
    category = models.CharField(max_length=100)  # bug, suggestion, query
    message = models.TextField()
    status = models.CharField(max_length=50, default="open")  # open, closed, in_progress
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Feedback {self.feedback_id} by {self.user}"
# Additional linking model (if you want bookmarks etc later)
class Bookmark(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    career = models.ForeignKey(Career, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "career")

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)

class Bookmark(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    career = models.ForeignKey(Career, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "career")


class PasswordResetToken(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    token = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    def __str__(self):
        return f"Token for {self.user.email}"



