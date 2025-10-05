from django.urls import path
from .views import view_main_page, view_contact_page, detail_page, CatalogPageView

app_name = 'main'

urlpatterns = [
    path('', view_main_page, name='view_main_page'),
    path('contacts', view_contact_page, name='view_contact_page'),
    path('catalog', CatalogPageView.as_view(), name='catalog'),
    path('<int:id>', detail_page, name='detail_page'),
]
