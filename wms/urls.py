from django.urls import path
from . import views
from . import rest_api

urlpatterns = [
    path('api/wms/', views.WebShopListCreate.as_view()),
    path('webshops/', rest_api.webshops_list),
    path('webshops/<int:pk>/', rest_api.webshops_detail),
    path('items/', rest_api.items),
]