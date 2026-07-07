import os
import json

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