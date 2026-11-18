from django.conf import settings
from django.conf.urls.static import static
from django.urls import include, path

from .views import csrf

urlpatterns = [
    path("api/csrf", csrf, name="csrf"),
    path("api/convert/", include("converter.urls")),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
