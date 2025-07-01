from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from ..serializers import ProductSerializer
from ..models import Product

@api_view(['GET'])
def get_products(request, id=None):
    """
    Retrieve a single product by ID or return all products.

    Args:
        id (int, optional): Product ID (can be passed via URL).

    Returns:
        - 200 OK with serialized product(s) data.
        - 404 Not Found if product with given ID does not exist.
    """
    if id:
        try:
            product = Product.objects.get(id=id)
            serializer = ProductSerializer(product)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Product.DoesNotExist:
            return Response(
                {"error": f"Product with ID {id} does not exist"},
                status=status.HTTP_404_NOT_FOUND
            )
    else:
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
def create_product(request):
    """
    Create a new product using provided request data.

    Expects:
        - JSON body with required product fields.

    Returns:
        - 201 Created with product data on success.
        - 400 Bad Request if validation fails.
    """
    serializer = ProductSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({
            'message': "Product created successfully",
            'product': serializer.data
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
def update_product(request):
    """
    Update an existing product based on provided ID and data.

    Expects:
        - JSON body containing 'id' and fields to update.

    Returns:
        - 200 OK with updated product data.
        - 400 Bad Request if ID is missing or data is invalid.
        - 404 Not Found if product does not exist.
    """
    product_id = request.data.get('id')
    if not product_id:
        return Response({'error': 'Product ID is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        product = Product.objects.get(id=product_id)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = ProductSerializer(product, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({
            'message': f'Product {product.sku} updated successfully',
            'product': serializer.data
        }, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def delete_product(request):
    """
    Delete a product by its ID.

    Expects:
        - JSON body with 'id' of the product to delete.

    Returns:
        - 204 No Content on successful deletion.
        - 400 Bad Request if ID is missing.
        - 404 Not Found if product does not exist.
    """
    product_id = request.data.get("id")
    if not product_id:
        return Response({'error': 'Product ID is required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        product = Product.objects.get(id=product_id)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

    product.delete()
    return Response({'message': 'Product deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
