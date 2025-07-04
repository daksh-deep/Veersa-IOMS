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

const Update = ({ id, onClose }: Props) => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    isActive: "",
  });

  const [customerName, setCustomerName] = useState<string>("");
  const [responseMsg, setResponseMsg] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const res = await axios.get(`${BASE_URL}customer/${id}`);
        setCustomerName(res.data.name);
      } catch (err) {
        console.error("Failed to fetch customer", err);
      }
    };
    fetchCustomer();
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
        payload[key] = key === "isActive" ? value === "true" : value;
      }
    });

    try {
      await axios.put(BASE_URL + "customer/update/", payload);
      setIsError(false);
      setResponseMsg("✅ Customer updated successfully.");
      setTimeout(onClose, 1200);
    } catch (err) {
      console.error(err);
      setIsError(true);
      setResponseMsg("❌ Failed to update customer.");
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
        Update Customer
      </Typography>

      <Typography variant="h4" color="text.secondary" mb={3}>
        ID: {id} {customerName && `- ${customerName}`}
      </Typography>

      <Divider sx={{ width: "100%", maxWidth: 600, mb: 3, borderColor: theme.palette.grey[700] }} />

      <Stack spacing={2} sx={{ width: "100%", maxWidth: 600 }}>
        <TextField
          label="Name"
          name="name"
          fullWidth
          placeholder={customerName ? `e.g. ${customerName}` : "e.g. Daksh Saxena"}
          value={formData.name}
          onChange={handleChange}
        />
        <TextField
          label="Email"
          name="email"
          fullWidth
          value={formData.email}
          onChange={handleChange}
        />
        <TextField
          label="Phone"
          name="phone"
          fullWidth
          value={formData.phone}
          onChange={handleChange}
        />
        <TextField
          label="Address"
          name="address"
          fullWidth
          multiline
          minRows={2}
          value={formData.address}
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

export default Update;
