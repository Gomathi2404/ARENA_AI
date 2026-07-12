from django.urls import path
from .views import chat_view, sync_view

urlpatterns = [
    path("chat/", chat_view, name="chat"),
    path("sync/", sync_view, name="sync"),
]