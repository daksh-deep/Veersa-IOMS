import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Stack,
  useTheme,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import axios from "axios";
import { useEffect, useState } from "react";

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  isActive: boolean;
}

interface Product {
  id: number;
  sku: string;
  product_name: string;
  product_price: string;
  stock_quantity: number;
  isActive: boolean;
}

interface OrderItem {
  id: number;
  product: Product;
  quantity: number;
}

interface Order {
  id: number;
  customer: Customer;
  created_at: string;
  items: OrderItem[];
}

const ListOrder = () => {
  const theme = useTheme();
  const BASE_URL = "http://127.0.0.1:8000/api/";
  const [orders, setOrders] = useState<Order[]>([]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get<Order[]>(BASE_URL + "order/");
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const calculateTotal = (items: OrderItem[]) => {
    return items.reduce((sum, item) => {
      const price = parseFloat(item.product.product_price || "0");
      return sum + price * item.quantity;
    }, 0);
  };

  return (
    <Box m={3}>
      <Typography variant="h2" fontWeight={600} mb={3}>
        ORDERS
      </Typography>

      {orders.length === 0 ? (
        <Typography>No orders found.</Typography>
      ) : (
        orders.map((order) => (
          <Accordion key={order.id} sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  Order #{order.id} — {order.customer.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(order.created_at).toLocaleString("en-IN")}
                </Typography>
              </Box>
            </AccordionSummary>

            <AccordionDetails>
              <Box>
                {/* Customer Info */}
                <Typography fontWeight={600} mb={1}>
                  Customer Details
                </Typography>
                <Stack spacing={0.5} mb={2}>
                  <Typography>Name: {order.customer.name}</Typography>
                  <Typography>Email: {order.customer.email}</Typography>
                  <Typography>Phone: {order.customer.phone}</Typography>
                  <Typography>Address: {order.customer.address}</Typography>
                </Stack>

                <Divider sx={{ my: 1 }} />

                {/* Order Items */}
                <Typography fontWeight={600} mb={1}>
                  Items Ordered
                </Typography>

                {order.items.length === 0 ? (
                  <Typography color="text.secondary">No items in this order.</Typography>
                ) : (
                  <Box>
                    {order.items.map((item) => (
                      <Box
                        key={item.id}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 1,
                          p: 1,
                          borderRadius: 1,
                          backgroundColor: theme.palette.action.hover,
                        }}
                      >
                        <Box>
                          <Typography fontWeight={500}>
                            {item.product.product_name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            SKU: {item.product.sku}
                          </Typography>
                        </Box>
                        <Box textAlign="right">
                          <Typography>
                            ₹{parseFloat(item.product.product_price).toFixed(2)} × {item.quantity}
                          </Typography>
                          <Typography fontWeight={600}>
                            ₹{(parseFloat(item.product.product_price) * item.quantity).toFixed(2)}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                )}

                <Divider sx={{ my: 2 }} />

                {/* Total */}
                <Typography fontSize="1.2rem" fontWeight={600}>
                  Total: ₹{calculateTotal(order.items).toFixed(2)}
                </Typography>
              </Box>
            </AccordionDetails>
          </Accordion>
        ))
      )}
    </Box>
  );
};

export default ListOrder;
