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

    def add(self, product_variant, quantity=1, override_quantity=False):
        """
        Добавить товар в корзину или обновить его количество
        """
        product_variant_id = str(product_variant.id)

        if product_variant_id in self.cart:
            # Товар уже в корзине, обновляем количество
            if override_quantity:
                self.cart[product_variant_id]['quantity'] = quantity
            else:
                self.cart[product_variant_id]['quantity'] += quantity
        else:
            # Добавляем новый товар
            self.cart[product_variant_id] = {
                'quantity': quantity,
                'price': str(product_variant.price),
                'product_name': product_variant.product.name,
                'color': product_variant.color.name,
                'material': product_variant.material.name,
                'sku': product_variant.sku,
            }

        self.save()

    def remove(self, product_variant):
        """
        Удалить товар из корзины
        """
        product_variant_id = str(product_variant.id)
        if product_variant_id in self.cart:
            del self.cart[product_variant_id]
            self.save()

    def remove_by_id(self, product_variant_id):
        """
        Удалить товар из корзины по ID
        """
        product_variant_id = str(product_variant_id)
        if product_variant_id in self.cart:
            del self.cart[product_variant_id]
            self.save()

    def update(self, product_variant_id, quantity):
        """
        Обновить количество товара
        """
        product_variant_id = str(product_variant_id)
        if product_variant_id in self.cart:
            if quantity > 0:
                self.cart[product_variant_id]['quantity'] = quantity
            else:
                # Если количество 0 или меньше, удаляем товар
                del self.cart[product_variant_id]
            self.save()

    def clear(self):
        """
        Очистить корзину
        """
        self.session['cart'] = {}
        self.save()

    def save(self):
        """
        Сохранить изменения в сессии
        """
        self.session.modified = True

    def __iter__(self):
        """
        Итерация по товарам в корзине
        """
        product_variant_ids = self.cart.keys()
        product_variants = ProductVariant.objects.filter(id__in=product_variant_ids)

        # Создаем копию корзины для работы с объектами
        cart = self.cart.copy()

        for product_variant in product_variants:
            product_variant_id = str(product_variant.id)
            cart[product_variant_id]['product_variant'] = product_variant
            cart[product_variant_id]['total_price'] = (
                    Decimal(cart[product_variant_id]['price']) * cart[product_variant_id]['quantity']
            )

        for item in cart.values():
            yield item

    def __len__(self):
        """
        Получить общее количество товаров в корзине
        """
        return sum(item['quantity'] for item in self.cart.values())

    def get_total_price(self):
        """
        Получить общую стоимость корзины
        """
        return sum(
            Decimal(item['price']) * item['quantity']
            for item in self.cart.values()
        )

    def get_items_count(self):
        """
        Получить количество позиций в корзине
        """
        return len(self.cart)

    def get_cart_items(self):
        """
        Получить все товары корзины с объектами ProductVariant
        """
        product_variant_ids = [int(id) for id in self.cart.keys()]
        product_variants = ProductVariant.objects.filter(id__in=product_variant_ids)

        cart_items = []
        for product_variant in product_variants:
            product_variant_id = str(product_variant.id)
            item_data = self.cart[product_variant_id].copy()
            item_data['product_variant'] = product_variant
            item_data['total_price'] = (
                    Decimal(item_data['price']) * item_data['quantity']
            )
            cart_items.append(item_data)

        return cart_items

    def get_item(self, product_variant_id):
        """
        Получить конкретный товар из корзины
        """
        product_variant_id = str(product_variant_id)
        return self.cart.get(product_variant_id)