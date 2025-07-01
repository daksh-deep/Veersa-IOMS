from django.views.decorators.csrf import ensure_csrf_cookie
from django.middleware.csrf import get_token
from django.http import JsonResponse

@ensure_csrf_cookie
def csrf_token_view(request):
    """
    Returns a CSRF token and ensures the CSRF cookie is set in the response.

    This view is typically used in frontend applications (e.g., React) to
    retrieve and store the CSRF token before making authenticated POST/PUT/DELETE requests.

    Returns:
        JsonResponse containing the CSRF token.
    """
    return JsonResponse({'csrfToken': get_token(request)})
