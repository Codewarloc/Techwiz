from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver

# -----------------------
# User & Manager
# -----------------------
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
    first_name = models.CharField(max_length=150, blank=True, default='John')
    last_name = models.CharField(max_length=150, blank=True, default='Doe')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="student")
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["uname"]

    def __str__(self):
        return self.email


# -----------------------
# Careers
# -----------------------
class Career(models.Model):
    career_id = models.BigAutoField(primary_key=True)
    title = models.CharField(max_length=255)
    description = models.TextField()
    domain = models.CharField(max_length=100) # Corresponds to 'category'
    required_skills = models.JSONField(default=list, blank=True)
    education_path = models.TextField(blank=True)
    expected_salary = models.CharField(max_length=100, blank=True) # Corresponds to 'salary'
    created_at = models.DateTimeField(auto_now_add=True)

    # New fields to match the frontend
    company = models.CharField(max_length=255, blank=True)
    demand = models.CharField(max_length=50, blank=True) # e.g., "High", "Very High"
    growth = models.CharField(max_length=50, blank=True) # e.g., "+22%"
    experience = models.CharField(max_length=50, blank=True) # e.g., "entry", "mid"
    salary_range = models.CharField(max_length=50, blank=True) # e.g., "80-120k"

    def __str__(self):
        return self.title


# -----------------------
# Resources
# -----------------------
class Resource(models.Model):
    TYPE_CHOICES = [
        ("PDF", "PDF Document"),
        ("Checklist", "Checklist"),
        ("Infographic", "Infographic"),
    ]
    AUDIENCE_CHOICES = [
        ("Student", "Student"),
        ("Graduate", "Graduate"),
        ("Professional", "Professional"),
        ("All", "All"),
    ]

    resource_id = models.BigAutoField(primary_key=True)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    # Type of resource (PDF, Checklist, etc.)
    category = models.CharField(max_length=100, choices=TYPE_CHOICES, default="PDF")
    # For self-hosted files
    file = models.FileField(upload_to="resources/", blank=True, null=True)
    # For externally linked files
    file_url = models.URLField(blank=True)
    # Backend-driven tags
    tags = models.JSONField(default=list, blank=True)
    target_audience = models.CharField(max_length=50, choices=AUDIENCE_CHOICES, default="All")
    # Counter for popularity tracking
    download_count = models.PositiveIntegerField(default=0)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name="resources")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


# -----------------------
# Success Stories
# -----------------------
class SuccessStory(models.Model):
    story_id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="success_stories")
    name = models.CharField(max_length=255)
    domain = models.CharField(max_length=100)
    education = models.TextField()
    challenge = models.TextField()
    outcome = models.TextField()
    is_approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Story by {self.name} in {self.domain}"


# -----------------------
# User Profiles
# -----------------------
class UserProfile(models.Model):
    profile_id = models.BigAutoField(primary_key=True)
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="profile")
    education_level = models.CharField(max_length=200, blank=True)
    interests = models.JSONField(default=list, blank=True)
    skills = models.JSONField(default=list, blank=True)
    profile_image = models.ImageField(upload_to="profiles/", blank=True, null=True)
    resume = models.FileField(upload_to="resumes/", blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Profile: {self.user.uname}"


# -----------------------
# Multimedia
# -----------------------
class Multimedia(models.Model):
    TYPE_CHOICES = [
        ("Video", "Video"),
        ("Podcast", "Podcast"),
        ("Explainer", "Explainer"),
    ]

    multimedia_id = models.BigAutoField(primary_key=True)
    title = models.CharField(max_length=255)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES, default="Video")
    # URL for external content like YouTube
    url = models.URLField(max_length=500, blank=True)
    # File for self-hosted content
    file = models.FileField(upload_to="multimedia/", blank=True, null=True)
    transcript = models.TextField(blank=True)
    tags = models.JSONField(default=list, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


# -----------------------
# Quiz
# -----------------------
class QuizQuestion(models.Model):
    question_id = models.BigAutoField(primary_key=True)
    text = models.CharField(max_length=500)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.text


class Option(models.Model):
    question = models.ForeignKey(QuizQuestion, on_delete=models.CASCADE, related_name="options")
    text = models.CharField(max_length=255)
    category = models.CharField(max_length=50)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.text} ({self.category})"


class QuizResult(models.Model):
    result_id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="quiz_results")
    scores = models.JSONField()
    best_category = models.CharField(max_length=100)
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Result {self.result_id} - {self.best_category}"


# -----------------------
# Feedback
# -----------------------
class Feedback(models.Model):
    CATEGORY_CHOICES = [
        ("bug", "Bug"),
        ("suggestion", "Suggestion"),
        ("query", "Query"),
    ]

    feedback_id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default="suggestion")
    message = models.TextField()
    submitted_at = models.DateTimeField(auto_now_add=True)


# -----------------------
# Bookmark
# -----------------------
class Bookmark(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    career = models.ForeignKey(Career, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "career")


# -----------------------
# Signals
# -----------------------
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)


# -----------------------
# Password Reset
# -----------------------
class PasswordResetToken(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    token = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    def __str__(self):
        return f"Token for {self.user.email}"
