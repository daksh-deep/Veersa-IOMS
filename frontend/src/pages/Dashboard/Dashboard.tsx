import { useTheme } from "@emotion/react";
import { Box, Typography, Paper } from "@mui/material";
import { useSelector } from "react-redux";
import { type RootState } from "../../app/store";
import axios from "axios";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const theme = useTheme();
  const [activeCustomersStats, setActiveCustomersStats] = useState<number>(0);

  const fetchActiveCustomerStats = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/customer/active/")
      setActiveCustomersStats(res.data)
    } catch (err) {

    }
  }

  useEffect(() => {
    fetchActiveCustomerStats();
  }, []);


  return (
    <Box m={3}>
      <Typography variant="h2" fontWeight={600} mb={3}>
        Welcome <span style={{ color: "yellow" }}>Admin</span>
      </Typography>

      <Box display="flex" gap={3} flexWrap="wrap">
        <Paper
          elevation={3}
          sx={{
            p: 3,
            flex: "1 1 250px",
            bgcolor: theme.palette.background.paper,
            borderRadius: 2,
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography variant="subtitle2" color="textSecondary" gutterBottom>
            Active Customers
          </Typography>
          <Typography variant="h4" fontWeight="bold" color="primary">
            {activeCustomersStats}
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default Dashboard;
