import {
  Box,
  TextField,
  Button,
  Typography,
  useTheme,
  Stack,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  Alert,
  Divider,
} from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";

interface Props {
  id: number;
  onClose: () => void;
}

const BASE_URL = "http://127.0.0.1:8000/api/";

const UpdateProduct = ({ id, onClose }: Props) => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    sku: "",
    product_name: "",
    product_price: "",
    stock_quantity: "",
    isActive: "",
  });

  const [productName, setProductName] = useState<string>("");
  const [responseMsg, setResponseMsg] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${BASE_URL}product/${id}`);
        setProductName(res.data.product_name);
      } catch (err) {
        console.error("Failed to fetch product", err);
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const payload: any = { id };

    Object.entries(formData).forEach(([key, value]) => {
      if (value.trim() !== "") {
        if (key === "product_price") {
          payload[key] = parseFloat(value);
        } else if (key === "stock_quantity") {
          payload[key] = parseInt(value);
        } else if (key === "isActive") {
          payload[key] = value === "true";
        } else {
          payload[key] = value;
        }
      }
    });

    try {
      await axios.put(BASE_URL + "product/update/", payload);
      setIsError(false);
      setResponseMsg("✅ Product updated successfully.");
      setTimeout(onClose, 1200);
    } catch (err) {
      console.error(err);
      setIsError(true);
      setResponseMsg("❌ Failed to update product.");
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
        Update Product
      </Typography>

      <Typography variant="h4" color="text.secondary" mb={3}>
        ID: {id} {productName && `- ${productName}`}
      </Typography>

      <Divider sx={{ width: "100%", maxWidth: 600, mb: 3, borderColor: theme.palette.grey[700] }} />

      <Stack spacing={2} sx={{ width: "100%", maxWidth: 600 }}>
        <TextField
          label="SKU"
          name="sku"
          fullWidth
          placeholder="e.g. P-001"
          value={formData.sku}
          onChange={handleChange}
        />
        <TextField
          label="Product Name"
          name="product_name"
          fullWidth
          placeholder={productName ? `e.g. ${productName}` : "e.g. T-Shirt"}
          value={formData.product_name}
          onChange={handleChange}
        />
        <TextField
          label="Price"
          name="product_price"
          type="number"
          fullWidth
          value={formData.product_price}
          onChange={handleChange}
        />
        <TextField
          label="Stock Quantity"
          name="stock_quantity"
          type="number"
          fullWidth
          value={formData.stock_quantity}
          onChange={handleChange}
        />

        <Box>
          <FormLabel component="legend" sx={{ color: theme.palette.text.primary, mb: 1 }}>
            Status
          </FormLabel>
          <RadioGroup
            row
            name="isActive"
            value={formData.isActive}
            onChange={handleChange}
          >
            <FormControlLabel value="true" control={<Radio />} label="Active" />
            <FormControlLabel value="false" control={<Radio />} label="Inactive" />
          </RadioGroup>
        </Box>

        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleSubmit}
          >
            Save Changes
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            size="large"
            onClick={onClose}
          >
            Cancel
          </Button>
        </Box>




        {responseMsg && (
          <Alert severity={isError ? "error" : "success"} sx={{ mt: 2 }}>
            {responseMsg}
          </Alert>
        )}
      </Stack>
    </Box>
  );
};

export default UpdateProduct;
