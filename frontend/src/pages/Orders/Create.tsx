import {
  Box,
  Typography,
  useTheme,
  Stack,
  TextField,
  Button,
  MenuItem,
  IconButton,
  Divider,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { useEffect, useState } from "react";

interface Customer {
  id: number;
  name: string;
}

interface Product {
  id: number;
  product_name: string;
  product_price: number;
  stock_quantity: number;
}

interface Props {
  onClose: () => void;
}

const BASE_URL = import.meta.env.VITE_BASE_URL;

const CreateOrder = ({ onClose }: Props) => {
  const theme = useTheme();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customerId, setCustomerId] = useState<number | "">("");
  const [selectedItems, setSelectedItems] = useState<
    { product_id: number; quantity: number }[]
  >([{ product_id: 0, quantity: 1 }]);

  const [responseMsg, setResponseMsg] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [custRes, prodRes] = await Promise.all([
          axios.get(BASE_URL + "customer/"),
          axios.get(BASE_URL + "product/"),
        ]);

        const activeCustomers = custRes.data.filter((cust: any) => cust.isActive);
        const activeProducts = prodRes.data.filter((prod: any) => (prod.isActive && prod.stock_quantity > 0));
        setCustomers(activeCustomers);
        setProducts(activeProducts);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const handleItemChange = (index: number, field: string, value: any) => {
    const updated = [...selectedItems];
    updated[index] = {
      ...updated[index],
      [field]: field === "quantity" ? parseInt(value) : value,
    };
    setSelectedItems(updated);
  };

  const handleAddItem = () => {
    setSelectedItems([...selectedItems, { product_id: 0, quantity: 1 }]);
  };

  const handleRemoveItem = (index: number) => {
    const updated = [...selectedItems];
    updated.splice(index, 1);
    setSelectedItems(updated);
  };

  const getProduct = (id: number) => products.find((p) => p.id === id);

  const totalAmount = selectedItems.reduce((acc, item) => {
    const product = getProduct(item.product_id);
    return acc + (product ? product.product_price * item.quantity : 0);
  }, 0);

  const handleSubmit = async () => {
    if (!customerId) {
      setIsError(true);
      setResponseMsg("❌ Please select a customer.");
      return;
    }

    const payload = {
      customer_id: customerId,
      items: selectedItems.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
      })),
    };

    try {
      await axios.post(BASE_URL + "order/create/", payload);
      setIsError(false);
      setResponseMsg("Order placed successfully!");
      setTimeout(onClose, 1200);
    } catch (err: any) {
      console.error(err);
      setIsError(true);

      const errorMsg =
        err?.response?.data?.detail ||
        err?.response?.data?.error ||
        "Failed to place order.";

      setResponseMsg(errorMsg);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        px: 3,
        py: 5,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        overflowY: "auto",
      }}
    >
      <Typography variant="h3" fontWeight={700} color="primary" mb={1}>
        Create Order
      </Typography>

      <Typography variant="h5" color="text.secondary" mb={3}>
        Select customer and products below
      </Typography>

      <Divider
        sx={{
          width: "100%",
          maxWidth: 700,
          mb: 3,
          borderColor: theme.palette.grey[700],
        }}
      />

      <Stack spacing={3} sx={{ width: "100%", maxWidth: 700 }}>
        <TextField
          select
          label="Select Customer"
          fullWidth
          value={customerId}
          onChange={(e) => setCustomerId(Number(e.target.value))}
        >
          {customers.map((cust) => (
            <MenuItem key={cust.id} value={cust.id}>
              {cust.name}
            </MenuItem>
          ))}
        </TextField>

        {selectedItems.map((item, index) => (
          <Stack
            key={index}
            direction="row"
            spacing={2}
            alignItems="center"
            sx={{ width: "100%" }}
          >
            <TextField
              select
              label="Product"
              fullWidth
              value={item.product_id}
              onChange={(e) =>
                handleItemChange(index, "product_id", Number(e.target.value))
              }
            >
              {products.map((prod) => (
                <MenuItem key={prod.id} value={prod.id}>
                  {prod.product_name} (₹{prod.product_price})
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Quantity"
              type="number"
              sx={{ width: 120 }}
              value={item.quantity}
              onChange={(e) =>
                handleItemChange(index, "quantity", e.target.value)
              }
              inputProps={{ min: 1 }}
            />

            <IconButton
              onClick={() => handleRemoveItem(index)}
              color="error"
              sx={{ mt: 1 }}
            >
              <DeleteIcon />
            </IconButton>
          </Stack>
        ))}

        <Button
          variant="outlined"
          color="secondary"
          onClick={handleAddItem}
          startIcon={<AddIcon />}
          sx={{ width: "fit-content" }}
        >
          Add Product
        </Button>

        <Divider />

        <Typography variant="h5" fontWeight={600}>
          Total: ₹ {totalAmount.toFixed(2)}
        </Typography>

        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Place Order
        </Button>

        {responseMsg && (
          <Alert severity={isError ? "error" : "success"}>{responseMsg}</Alert>
        )}
      </Stack>
    </Box>
  );
};

export default CreateOrder;
