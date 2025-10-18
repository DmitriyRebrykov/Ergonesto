from django.shortcuts import render, redirect, get_object_or_404
from django.views.decorators.http import require_POST
from django.contrib import messages
from apps.main.models import ProductVariant
from .cart import Cart


def cart_detail(request):
    """Детальная страница корзины"""
    cart = Cart(request)
    return render(request, 'cart/cart_detail.html', {'cart': cart})


@require_POST
def cart_add(request, product_variant_id):
    """Добавление товара в корзину"""
    cart = Cart(request)
    product_variant = get_object_or_404(ProductVariant, id=product_variant_id)

    quantity = int(request.POST.get('quantity', 1))


    cart.add(product_variant, quantity=quantity)
    messages.success(request, 'Товар добавлен в корзину')

    # Редирект на предыдущую страницу или детали корзины
    return redirect('cart:cart_detail')


@require_POST
def cart_remove(request, product_variant_id):
    """Удаление товара из корзины"""
    cart = Cart(request)
    product_variant = get_object_or_404(ProductVariant, id=product_variant_id)
    cart.remove(product_variant)
    messages.success(request, 'Товар удален из корзины')
    return redirect('cart:cart_detail')


@require_POST
def cart_update(request, product_variant_id):
    """Обновление количества товара в корзине"""
    cart = Cart(request)
    quantity = int(request.POST.get('quantity', 1))

    if quantity > 0:
        # Проверяем наличие на складе
        product_variant = get_object_or_404(ProductVariant, id=product_variant_id)
        inventory = product_variant.inventory.first()
        if inventory:
            available_quantity = inventory.quantity_on_hand - inventory.quantity_reserved
            if quantity > available_quantity:
                messages.error(request, f'Недостаточно товара на складе. Доступно: {available_quantity} шт.')
                return redirect('cart:cart_detail')

        cart.update(product_variant_id, quantity)
        messages.success(request, 'Количество товара обновлено')
    else:
        cart.remove_by_id(product_variant_id)
        messages.success(request, 'Товар удален из корзины')

    return redirect('cart_detail')


def cart_clear(request):
    """Очистка корзины"""
    cart = Cart(request)
    cart.clear()
    messages.success(request, 'Корзина очищена')
    return redirect('cart:cart_detail')