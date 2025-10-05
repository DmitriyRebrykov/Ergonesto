from django.core.validators import RegexValidator
from django.db import models
from django.utils.text import slugify
from django.db.models.signals import post_delete
from django.dispatch import receiver
import os

class ProductType(models.TextChoices):
    MODULE = 'MODULE', 'Module'
    FOOTREST = 'FOOTREST', 'Footrest'

class Product(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    description = models.TextField()
    main_image = models.ImageField(upload_to='products/main/')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    is_active = models.BooleanField(default=True)

    product_type = models.CharField(max_length=40, choices=ProductType.choices, default=ProductType.choices)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = 'Product'
        verbose_name_plural = 'Products'
        db_table = 'product'

    def __str__(self):
        return self.name


class Color(models.Model):
    name = models.CharField(max_length=100)
    hex_color = models.CharField(max_length=7, validators=[RegexValidator
                                                           (regex=r'^#[0-9A-Fa-f]{6}$',
                                                            message='Введите корректный HEX код (например, #FFFFFF)')],
                                                            help_text="Шестнадцатеричный код цвета (например, #FFFFFF)")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.name} | {self.hex_color}'

    class Meta:
        verbose_name = 'Color'
        verbose_name_plural = 'Colors'
        db_table = 'color'


class Material(models.Model):
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=100, choices=ProductType.choices, default=ProductType.choices)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Material'
        verbose_name_plural = 'Materials'
        db_table = 'material'


class ProductVariant(models.Model):
    price = models.DecimalField(max_digits=10, decimal_places=2)
    sku = models.CharField(max_length=100, unique=True, db_index=True, blank=True)
    weight_grams = models.PositiveIntegerField(default=1)
    dimensions_mm = models.PositiveIntegerField(default=1)
    is_active = models.BooleanField(default=True)

    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='variants')
    color = models.ForeignKey(Color, on_delete=models.PROTECT, related_name='product_variants')
    material = models.ForeignKey(Material, on_delete=models.PROTECT, related_name='product_variants')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.sku:
            self.sku += f'P{'0' * (4 - len(str(self.product.id)))}{self.product.id}-'
            self.sku += f'C{'0' * (4 - len(str(self.color.id)))}{self.color.id}-'
            self.sku += f'M{'0' * (4 - len(str(self.material.id)))}{self.material.id}'
        super().save( *args, **kwargs)
            

    def __str__(self):
        return f'{self.product} | {self.color} | {self.material}'

    class Meta:
        verbose_name = 'Product variant'
        verbose_name_plural = 'Product variant'
        db_table = 'product_option'


class Inventory(models.Model):
    variant = models.ForeignKey(ProductVariant, models.CASCADE, related_name='inventory')
    quantity_on_hand = models.PositiveIntegerField(default=0)
    quantity_reserved = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f'{self.variant.sku} | На складе:'

    class Meta:
        verbose_name = 'Inventory'
        verbose_name_plural = 'Inventories'
        db_table = 'inventory'

class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='product_images')
    image = models.ImageField(upload_to='products/extra/')


# in case product should be deleted we use the function to clear media (deleting images)
@receiver(post_delete, sender=Product)
def delete_product_image(sender, instance, **kwargs):
    if instance.main_image:
        if os.path.isfile(instance.main_image.path):
            os.remove(instance.main_image.path)