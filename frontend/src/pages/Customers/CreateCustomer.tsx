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

const BASE_URL = import.meta.env.VITE_BASE_URL;

const CreateCustomer = ({ onClose }: Props) => {
  const theme = useTheme();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    isActive: "true",
  });

  // UI feedback state
  const [responseMsg, setResponseMsg] = useState("");
  const [isError, setIsError] = useState(false);

  // Input handler
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
      isActive: formData.isActive === "true",
    };

    try {
      await axios.post(BASE_URL + "customer/create/", payload);
      setIsError(false);
      setResponseMsg("✅ Customer created successfully.");
      setTimeout(onClose, 1200);
    } catch (err) {
      console.error(err);
      setIsError(true);
      setResponseMsg("❌ Failed to create customer.");
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
        Create Customer
      </Typography>
      <Typography variant="h5" color="text.secondary" mb={3}>
        Fill in the details below
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
          label="Name"
          name="name"
          fullWidth
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
            Add Customer
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

export default CreateCustomer;
