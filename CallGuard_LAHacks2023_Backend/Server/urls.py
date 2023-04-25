"""
URL configuration for blocker project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from . import api
from .views import AudioTranscriptionView


urlpatterns = [
    # path('admin/', admin.site.urls),
    path('api/whisper/', api.my_api),
    path('api/cohere/', api.cohere_api),
    # path('audio_transcription/', AudioTranscriptionView.as_view(),
    #      name='audio_transcription'),
    path('api/openai/', api.openai_api),
]
