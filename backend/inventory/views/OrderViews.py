from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from ..serializers import OrderSerializer
from ..models import Order, Product, OrderItem

@api_view(['GET'])
def get_orders(request):
    """
    Retrieve all orders from the database.

    Returns:
        - 200 OK with a list of all serialized orders.
    """
    orders = Order.objects.all()
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_order(request, id):
    """
    Retrieve a single order by its ID.

    Args:
        id (int): Order ID passed in the URL.

    Returns:
        - 200 OK with serialized order data.
        - 404 Not Found if order with given ID does not exist.
    """
    try:
        order = Order.objects.get(id=id)
    except Order.DoesNotExist:
        return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)

    serializer = OrderSerializer(order)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
def create_order(request):
    """
    Create a new order with nested order items.

    Expects:
        - JSON body with valid customer ID and list of items.

    Returns:
        - 201 Created on successful order creation.
        - 400 Bad Request if validation fails.
    """
    serializer = OrderSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'Order placed successfully'}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def delete_order(request):
    """
    Delete an order by ID and restore stock for each item.

    Expects:
        - JSON body with the 'id' of the order to delete.

    Logic:
        - Each item's product stock is incremented before deletion.

    Returns:
        - 204 No Content on success.
        - 400 Bad Request if ID is missing.
        - 404 Not Found if the order does not exist.
    """
    order_id = request.data.get("id")
    if not order_id:
        return Response({'error': 'Order ID is required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        order = Order.objects.get(id=order_id)
    except Order.DoesNotExist:
        return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)

    # Restore stock quantities for each order item
    for item in order.orderitem_set.all():
        item.product.stock_quantity += item.quantity
        item.product.save()

    order.delete()
    return Response({'message': 'Order deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
