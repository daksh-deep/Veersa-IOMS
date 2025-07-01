from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from ..models import Customer
from ..serializers import CustomerSerializer

@api_view(['GET'])
def get_customers(request, id=None):
    """
    Retrieve a single customer by ID or return all customers.

    Args:
        id (int, optional): Customer ID (passed via URL or query).

    Returns:
        - 200 OK with serialized customer(s) data.
        - 404 Not Found if customer with given ID does not exist.
    """
    if id:
        try:
            customer = Customer.objects.get(id=id)
            serializer = CustomerSerializer(customer)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Customer.DoesNotExist:
            return Response(
                {"error": f"Customer with ID {id} does not exist"},
                status=status.HTTP_404_NOT_FOUND
            )
    else:
        customers = Customer.objects.all()
        serializer = CustomerSerializer(customers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
def create_customer(request):
    """
    Create a new customer using the provided request data.

    Expects:
        JSON body with required customer fields.

    Returns:
        - 201 Created on success with serialized customer data.
        - 400 Bad Request if data validation fails.
    """
    serializer = CustomerSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(
            {
                'message': "Customer created successfully",
                'customer': serializer.data
            },
            status=status.HTTP_201_CREATED
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
def update_customer(request):
    """
    Update an existing customer based on ID and request data.

    Expects:
        - JSON body containing 'id' and fields to update.

    Returns:
        - 200 OK with updated customer data.
        - 400 Bad Request if ID is missing or data is invalid.
        - 404 Not Found if customer does not exist.
    """
    customer_id = request.data.get("id")
    if not customer_id:
        return Response({'error': 'Customer ID is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        customer = Customer.objects.get(id=customer_id)
    except Customer.DoesNotExist:
        return Response({'error': 'Customer not found'}, status=status.HTTP_404_NOT_FOUND)

    serializer = CustomerSerializer(customer, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(
            {
                'message': 'Customer updated successfully',
                'customer': serializer.data
            },
            status=status.HTTP_200_OK
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def delete_customer(request):
    """
    Delete a customer by ID.

    Expects:
        - JSON body containing the 'id' of the customer to delete.

    Returns:
        - 204 No Content on successful deletion.
        - 400 Bad Request if ID is missing.
        - 404 Not Found if customer does not exist.
    """
    customer_id = request.data.get("id")
    if not customer_id:
        return Response({'error': 'Customer ID is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        customer = Customer.objects.get(id=customer_id)
    except Customer.DoesNotExist:
        return Response({'error': 'Customer not found'}, status=status.HTTP_404_NOT_FOUND)

    customer.delete()
    return Response({'message': 'Customer deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
