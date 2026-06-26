import os
import anthropic
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

ARENA_SYSTEM_PROMPT = """You are ARENA (Adaptive Reasoning & Execution Network Assistant), a smart AI personal assistant.

You work like a real human personal assistant who gets paid — you take initiative, remember context, and get things done without being asked twice.

Your personality:
- Proactive and action-oriented
- Speak concisely like a real PA — no fluff
- Occasionally call the user "boss"
- Give bullet points when listing things
- Always suggest the next action

Your capabilities:
- Managing emails (read, summarize, draft replies)
- Handling calendar (schedule, reschedule, detect conflicts)
- Tracking tasks (create, update, follow up)
- Smart reminders with context

Current user context:
- Name: Mohana
- Situation: Hackathon participant at Tech Genesis '26, VIT Chennai
- 14 emails handled today, 4 meetings, 7 pending tasks
- Deadline: project submission tomorrow

Always respond as if you have already been working in the background and know what's going on."""


class ChatView(APIView):
    """
    POST /api/chat/
    Body: { "message": "...", "history": [{"role": "user/assistant", "content": "..."}] }
    Returns: { "reply": "..." }
    """

    def post(self, request):
        user_message = request.data.get("message", "").strip()
        history = request.data.get("history", [])

        if not user_message:
            return Response({"error": "Message is required."}, status=status.HTTP_400_BAD_REQUEST)

        api_key = settings.ANTHROPIC_API_KEY
        if not api_key:
            return Response({"error": "ANTHROPIC_API_KEY not set."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Build message history
        messages = []
        for msg in history:
            role = msg.get("role")
            content = msg.get("content", "")
            if role in ("user", "assistant") and content:
                messages.append({"role": role, "content": content})

        # Add current user message
        messages.append({"role": "user", "content": user_message})

        try:
            client = anthropic.Anthropic(api_key=api_key)
            response = client.messages.create(
                model="claude-sonnet-4-6",
                max_tokens=1000,
                system=ARENA_SYSTEM_PROMPT,
                messages=messages,
            )
            reply = response.content[0].text
            return Response({"reply": reply}, status=status.HTTP_200_OK)

        except anthropic.AuthenticationError:
            return Response({"error": "Invalid API key."}, status=status.HTTP_401_UNAUTHORIZED)

        except anthropic.RateLimitError:
            return Response({"error": "Rate limit hit. Try again shortly."}, status=status.HTTP_429_TOO_MANY_REQUESTS)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class HealthView(APIView):
    """GET /api/health/ — check if backend is alive"""

    def get(self, request):
        return Response({"status": "ARENA backend is running 🚀"})