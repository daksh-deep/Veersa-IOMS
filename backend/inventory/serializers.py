from rest_framework import serializers
from .models import Customer, Product, Order, OrderItem

class CustomerSerializer(serializers.ModelSerializer):
    """
    Serializer for Customer model.
    Handles serialization and deserialization of Customer data.
    """
    class Meta:
        model = Customer
        fields = '__all__'


class ProductSerializer(serializers.ModelSerializer):
    """
    Serializer for Product model.
    Includes all fields for full CRUD support.
    """
    class Meta:
        model = Product
        fields = '__all__'


class OrderItemSerializer(serializers.ModelSerializer):
    """
    Serializer for individual order items.
    
    - Includes nested read-only product details.
    - Accepts product ID as input via 'product_id'.
    """
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(), source='product', write_only=True
    )

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_id', 'quantity']


class OrderSerializer(serializers.ModelSerializer):
    """
    Serializer for Order model with nested order items.

    - Returns nested customer and items data (read-only).
    - Accepts customer ID and item list in POST requests.
    """
    customer = CustomerSerializer(read_only=True)
    customer_id = serializers.PrimaryKeyRelatedField(
        queryset=Customer.objects.all(), source='customer', write_only=True
    )
    items = OrderItemSerializer(source='orderitem_set', many=True)

    class Meta:
        model = Order
        fields = ['id', 'customer', 'customer_id', 'created_at', 'items']

    def create(self, validated_data):
        """
        Override default create method to:
        - Create Order instance.
        - Validate stock for each product.
        - Reduce product stock accordingly.
        - Create corresponding OrderItem entries.

        Raises:
            serializers.ValidationError if any product lacks sufficient stock.
        """
        items_data = validated_data.pop('orderitem_set')
        order = Order.objects.create(**validated_data)

        for item_data in items_data:
            product = item_data['product']
            quantity = item_data['quantity']

            # Validate product stock
            if product.stock_quantity < quantity:
                raise serializers.ValidationError({
                    'error': f"Not enough stock for product '{product.product_name}'"
                })

            # Deduct stock and save
            product.stock_quantity -= quantity
            product.save()

            # Create the order item
            OrderItem.objects.create(order=order, product=product, quantity=quantity)

        return order
