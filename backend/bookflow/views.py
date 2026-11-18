from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_GET


# The React dev server doesn't come from Django, so it asks here for the CSRF cookie.
@require_GET
@ensure_csrf_cookie
def csrf(request):
    return JsonResponse({})
