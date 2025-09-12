from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from core.views import current_user
from core.views import PasswordResetRequestView, PasswordResetConfirmView # Import new views

urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/", include("core.urls")),
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/auth/me/", current_user, name="current_user"),
    path("api/auth/password-reset/", PasswordResetRequestView.as_view(), name="password_reset_request"),
    path("api/auth/password-reset/confirm/", PasswordResetConfirmView.as_view(), name="password_reset_confirm"),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
