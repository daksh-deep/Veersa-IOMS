import {Box, TextField, Button, Typography, useTheme, Stack, Alert, Divider} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../api/auth";
import { useDispatch } from "react-redux";
import { setAdminName } from "../../features/admin/adminSlice";

const Login = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [responseMsg, setResponseMsg] = useState("");
  const [isError, setIsError] = useState(false);
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await loginUser(username, password);
    if (success) {
      setIsError(false);
      setResponseMsg("Login successful!");
      dispatch(setAdminName(username))

      setTimeout(() => navigate("/dashboard"), 1000);

    } else {
      setIsError(true);
      setResponseMsg("❌ Invalid username or password.");
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
        Login
      </Typography>
      <Typography variant="h5" color="text.secondary" mb={3}>
        Enter your credentials to continue
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
      <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: 600 }}>
        <Stack spacing={2}>
          <TextField
            label="Username"
            name="username"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            name="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
          >
            Login
          </Button>

          {/* Feedback */}
          {responseMsg && (
            <Alert severity={isError ? "error" : "success"}>{responseMsg}</Alert>
          )}
        </Stack>
      </form>
    </Box>
  );
};

export default Login;
