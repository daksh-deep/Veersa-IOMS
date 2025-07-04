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
import { useState } from "react";
import axios from "axios";

interface Props {
  onClose: () => void;
}

const BASE_URL = "http://127.0.0.1:8000/api/";

const CreateProduct = ({ onClose }: Props) => {
  const theme = useTheme();

  // Form state
  const [formData, setFormData] = useState({
    sku: "",
    product_name: "",
    product_price: "",
    stock_quantity: "",
    isActive: "true",
  });

  // Feedback state
  const [responseMsg, setResponseMsg] = useState("");
  const [isError, setIsError] = useState(false);

  // Input change handler
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit handler
  const handleSubmit = async () => {
    const payload = {
      ...formData,
      product_price: parseFloat(formData.product_price),
      stock_quantity: parseInt(formData.stock_quantity),
      isActive: formData.isActive === "true",
    };

    try {
      await axios.post(BASE_URL + "product/create/", payload);
      setIsError(false);
      setResponseMsg("✅ Product created successfully.");
      setTimeout(onClose, 1200);
    } catch (err) {
      console.error(err);
      setIsError(true);
      setResponseMsg("❌ Failed to create product.");
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
      {/* Header */}
      <Typography variant="h3" fontWeight={700} color="primary" mb={1}>
        Create Product
      </Typography>
      <Typography variant="h5" color="text.secondary" mb={3}>
        Fill in the product details below
      </Typography>
      <Divider
        sx={{
          width: "100%",
          maxWidth: 600,
          mb: 3,
          borderColor: theme.palette.grey[700],
        }}
      />

      {/* Form */}
      <Stack spacing={2} sx={{ width: "100%", maxWidth: 600 }}>
        <TextField
          label="SKU"
          name="sku"
          fullWidth
          value={formData.sku}
          onChange={handleChange}
        />
        <TextField
          label="Product Name"
          name="product_name"
          fullWidth
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

        {/* Status */}
        <Box>
          <FormLabel component="legend" sx={{ mb: 1 }}>
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

        {/* Buttons */}
        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleSubmit}
          >
            Add Product
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

        {/* Feedback */}
        {responseMsg && (
          <Alert severity={isError ? "error" : "success"} sx={{ mt: 2 }}>
            {responseMsg}
          </Alert>
        )}
      </Stack>
    </Box>
  );
};

export default CreateProduct;
