from decimal import Decimal
from django.shortcuts import get_object_or_404
from apps.main.models import ProductVariant

class Cart:
    def __init__(self, request):
        self.session = request.session
        cart = self.session.get('cart')
        if not cart:
            cart = self.session['cart'] = {}
        self.cart = cart

        def add(self, product, quantity, override_quantity=False):
            product_id = str(product.id)