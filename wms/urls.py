from django.urls import path
from . import views

urlpatterns = [
    path('api/wms/', views.WebShopListCreate.as_view()),
]