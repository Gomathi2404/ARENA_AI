from django.urls import path
from .views import ChatView, HealthView

urlpatterns = [
    path("chat/", ChatView.as_view(), name="chat"),
    path("health/", HealthView.as_view(), name="health"),
]