from django.shortcuts import render, get_object_or_404
from django.views.generic import ListView

from apps.main.models import ProductVariant
from common.views import TitleMixin


def view_main_page(request):
    return render(request,'main/main.html')

def view_contact_page(request):
    return render(request, 'main/contacts.html')

def detail_page(request, id):
    product = get_object_or_404(ProductVariant, id=id)
    context = {'product':product}
    return render(request, 'main/detail.html', context=context)

class CatalogPageView(TitleMixin, ListView):
    model = ProductVariant
    template_name = 'main/catalog.html'
    context_object_name = 'products'
    title = 'Catalog'




