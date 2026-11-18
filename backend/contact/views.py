from bookflow import mail, public
from bookflow.responses import error
from django.views.decorators.http import require_POST

from .models import Message

# The longest message, in characters
MAX_TEXT = 5000
KINDS = {kind for kind, _ in Message.KIND_CHOICES}
SUBJECTS = {
    "message":   "Message from {sender}",
    "problem":   "Problem reported by {sender}",
}


@require_POST
def contact_create(request):
    kind = request.POST.get("kind", "message")
    if kind not in KINDS:
        return error("bad_kind", "Not something the contact page sends")
    return message_create(request, kind)


@public.limited("message")
def message_create(request, kind):
    fields = public.fields(request, "name", "email", "link", "text")
    if not fields["text"]:
        return error("no_text", "The message is empty")
    if public.too_long(fields, Message, text=MAX_TEXT):
        return error("too_long", f"Messages up to {MAX_TEXT} characters")
    if fields["email"] and not public.is_email(fields["email"]):
        return error("bad_email", "That isn't an email address")
    if kind == "message":
        fields["link"] = ""

    message = Message.objects.create(kind=kind, **fields)
    sender = message.name or message.email or "Someone"
    about = f"About: {message.link}\n\n" if message.link else ""
    mail.notify(
        SUBJECTS[kind].format(sender=sender),
        f"{about}{message.text}\n\n— {sender} {message.email}\n{mail.admin_url(message)}",
        reply_to=message.email,
    )
    return public.created()
