import os
import json
import re
import urllib.error
import urllib.request
import urllib.parse

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

import google.generativeai as genai

# Configure Gemini once at module load.
# Set GEMINI_API_KEY in your environment / .env file (never hardcode the key).
genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))

# System instruction shapes ARENA's personality - tweak as needed.
SYSTEM_INSTRUCTION = (
    "You are ARENA, a personal AI assistant. You help the user manage email, "
    "calendar, and tasks. Be concise, direct, and helpful."
)

model = genai.GenerativeModel(
    model_name="gemini-2.5-flash",
    system_instruction=SYSTEM_INSTRUCTION,
)

EMAIL_WEBHOOK_URL = os.environ.get(
    "EMAIL_WEBHOOK_URL",
    "https://gricelda-nondeclaratory-erasmo.ngrok-free.dev/webhook/emails",
)
SYNC_WORKFLOW_URL = os.environ.get(
    "SYNC_WORKFLOW_URL",
    "https://gricelda-nondeclaratory-erasmo.ngrok-free.dev/webhook/5b1c5ca0-fc72-42ee-bee7-801549d6bb9f",
)


def _build_history(raw_history):
    """
    Convert the frontend's {role, content} list into Gemini's expected
    format: role must be 'user' or 'model', and content must be a list of parts.
    """
    gemini_history = []
    for turn in raw_history or []:
        role = turn.get("role")
        text = turn.get("content", "")
        if not text:
            continue
        # Gemini uses 'model' instead of 'assistant'
        gemini_role = "model" if role == "assistant" else "user"
        gemini_history.append({"role": gemini_role, "parts": [text]})
    return gemini_history


def _fetch_json(url, method="GET", body=None):
    headers = {
        "Accept": "application/json",
        "ngrok-skip-browser-warning": "1",
    }
    if body is not None:
        headers["Content-Type"] = "application/json"
        data = json.dumps(body).encode("utf-8")
    else:
        data = None

    request = urllib.request.Request(url, data=data, headers=headers, method=method)
    with urllib.request.urlopen(request, timeout=30) as response:
        raw = response.read().decode("utf-8")

    if not raw.strip():
        return None

    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        return raw


def _extract_emails(payload):
    if isinstance(payload, list):
        return payload

    if isinstance(payload, dict):
        for key in ("emails", "data", "items", "results", "messages", "payload"):
            value = payload.get(key)
            if isinstance(value, list):
                return value
            if isinstance(value, str):
                try:
                    parsed = json.loads(value)
                except json.JSONDecodeError:
                    continue
                if isinstance(parsed, list):
                    return parsed

    return []


def _build_email_text(email):
    subject = str(email.get("subject") or "")
    snippet = str(email.get("snippet") or email.get("body") or email.get("content") or "")
    return f"{subject} {snippet}".lower()


def _looks_like_task(email):
    text = _build_email_text(email)
    return bool(re.search(r"\b(action required|todo|to-do|task|deadline|due|follow up|follow-up|submit|reminder|review|apply|complete|respond)\b", text))


def _looks_like_calendar(email):
    text = _build_email_text(email)
    return bool(re.search(r"\b(meeting|calendar|invite|schedule|reschedule|appointment|call|standup|sync|demo|workshop|interview|event)\b", text))


@csrf_exempt
@require_http_methods(["POST"])
def sync_view(request):
    try:
        emails_payload = _fetch_json(EMAIL_WEBHOOK_URL)
        recent_emails = _extract_emails(emails_payload)[:20]

        task_items = [
            {
                "title": email.get("subject") or "Task from email",
                "from": email.get("from") or email.get("sender") or "",
                "snippet": email.get("snippet") or "",
                "sourceId": email.get("id") or email.get("messageId") or "",
            }
            for email in recent_emails
            if isinstance(email, dict) and _looks_like_task(email)
        ]

        calendar_items = [
            {
                "title": email.get("subject") or "Calendar item from email",
                "from": email.get("from") or email.get("sender") or "",
                "snippet": email.get("snippet") or "",
                "sourceId": email.get("id") or email.get("messageId") or "",
            }
            for email in recent_emails
            if isinstance(email, dict) and _looks_like_calendar(email)
        ]

        workflow_query = urllib.parse.urlencode(
            {
                "emailsSynced": len(recent_emails),
                "tasksQueued": len(task_items),
                "calendarEventsQueued": len(calendar_items),
            }
        )

        workflow_response = _fetch_json(f"{SYNC_WORKFLOW_URL}?{workflow_query}", method="GET")

        message = "Sync completed."
        if isinstance(workflow_response, dict):
            message = workflow_response.get("message") or workflow_response.get("status") or message
        elif isinstance(workflow_response, str) and workflow_response.strip():
            message = workflow_response.strip()

        return JsonResponse(
            {
                "message": message,
                "emailsSynced": len(recent_emails),
                "tasksQueued": len(task_items),
                "calendarEventsQueued": len(calendar_items),
                "workflowResponse": workflow_response,
            }
        )
    except urllib.error.URLError as exc:
        return JsonResponse({"message": f"Sync failed: {exc}"}, status=502)
    except Exception as exc:
        return JsonResponse({"message": f"Sync failed: {exc}"}, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def chat_view(request):
    try:
        body = json.loads(request.body.decode("utf-8"))
    except json.JSONDecodeError:
        return JsonResponse({"reply": "Invalid request body."}, status=400)

    message = (body.get("message") or "").strip()
    raw_history = body.get("history", [])

    if not message:
        return JsonResponse({"reply": "Message cannot be empty."}, status=400)

    if not os.environ.get("GEMINI_API_KEY"):
        return JsonResponse(
            {"reply": "Server misconfigured: GEMINI_API_KEY is not set."},
            status=500,
        )

    try:
        chat_session = model.start_chat(history=_build_history(raw_history))
        response = chat_session.send_message(message)
        reply_text = response.text
    except Exception as exc:
        # Log the real error server-side; keep the client message generic.
        print(f"[ARENA][Gemini error] {exc}")
        reply_text = "I ran into an issue reaching the AI model. Please try again."

    return JsonResponse({"reply": reply_text})