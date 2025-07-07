import { useTheme } from "@emotion/react";
import { Box, Typography, Paper, Grid, Divider} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

interface Product {
  id: number;
  sku: string;
  product_name: string;
  stock_quantity: number;
}

interface TopSellingProduct {
  product_name: string;
  totalSold: number;
}

const Dashboard = () => {
  const theme = useTheme();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [activeCustomersStats, setActiveCustomersStats] = useState<number>(0);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [outOfStockProducts, setOutOfStockProducts] = useState<Product[]>([]);
  const [topSellingProducts, setTopSellingProducts] = useState<TopSellingProduct[]>([]);
  const [netSales, setNetSales] = useState<number>(0);

  const computeTopSellingProducts = (orders: any[]): TopSellingProduct[] => {
    const productSalesMap: Record<number, TopSellingProduct> = {};

    orders.forEach((order) => {
      order.items.forEach((item: any) => {
        const id = item.product.id;
        const name = item.product.product_name;
        const quantity = item.quantity;

        if (!productSalesMap[id]) {
          productSalesMap[id] = {
            product_name: name,
            totalSold: 0,
          };
        }

        productSalesMap[id].totalSold += quantity;
      });
    });

    return Object.values(productSalesMap)
      .sort((a, b) => b.totalSold - a.totalSold)
      .slice(0, 5);
  };

  const computeNetSales = (orders: any[]): number => {
    let total = 0;
    orders.forEach((order) => {
      order.items.forEach((item: any) => {
        const price = parseFloat(item.product.product_price);
        total += price * item.quantity;
      });
    });
    return total;
  };

  const fetchData = async () => {
    try {
      const productRes = await axios.get(BASE_URL + "product/");
      const products: Product[] = productRes.data;

      setLowStockProducts(products.filter((p) => p.stock_quantity > 0 && p.stock_quantity <= 5));
      setOutOfStockProducts(products.filter((p) => p.stock_quantity === 0));

      const activeRes = await axios.get(BASE_URL + "customer/active/");
      setActiveCustomersStats(activeRes.data);

      const orderRes = await axios.get(BASE_URL + "order/");
      const orders = orderRes.data;

      setTopSellingProducts(computeTopSellingProducts(orders));
      setNetSales(computeNetSales(orders));
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Box m={3}>
      <Typography variant="h3" fontWeight={700} mb={2}>
        Admin Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Active Customers */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
              Active Customers
            </Typography>
            <Typography variant="h4" fontWeight="bold" color="primary">
              {activeCustomersStats}
            </Typography>
          </Paper>
        </Grid>

        {/* Net Sales */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
              Net Sales
            </Typography>
            <Typography variant="h4" fontWeight="bold" color="success.main">
              ₹{netSales.toFixed(2)}
            </Typography>
          </Paper>
        </Grid>

        {/* Low Stock Count */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
              Low Stock Products
            </Typography>
            <Typography variant="h4" fontWeight="bold" color="warning.main">
              {lowStockProducts.length}
            </Typography>
          </Paper>
        </Grid>

        {/* Out of Stock Count */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
              Out of Stock Products
            </Typography>
            <Typography variant="h4" fontWeight="bold" color="error">
              {outOfStockProducts.length}
            </Typography>
          </Paper>
        </Grid>

        {/* Top Selling Products */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
              Top 5 Selling Products
            </Typography>
            <Divider sx={{ mb: 1 }} />
            {topSellingProducts.length > 0 ? (
              topSellingProducts.map((prod, index) => (
                <Typography key={index} variant="body1" sx={{ mb: 0.5 }}>
                  {index + 1}. {prod.product_name} — {prod.totalSold} sold
                </Typography>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No sales yet.
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Detailed Low Stock List */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="subtitle2" color="warning.main" gutterBottom>
              Low Stock Details (≤ 5)
            </Typography>
            <Divider sx={{ mb: 1 }} />
            {lowStockProducts.length > 0 ? (
              lowStockProducts.map((prod, index) => (
                <Typography key={prod.id} variant="body2" sx={{ mb: 0.5 }}>
                  {index + 1}. {prod.product_name} - (SKU: {prod.sku})
                </Typography>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No low stock products.
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Detailed Out of Stock List */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="subtitle2" color="error" gutterBottom>
              Out of Stock Details
            </Typography>
            <Divider sx={{ mb: 1 }} />
            {outOfStockProducts.length > 0 ? (
              outOfStockProducts.map((prod, index) => (
                <Typography key={prod.id} variant="body2" sx={{ mb: 0.5 }}>
                  {index + 1}. {prod.product_name} — Qty: {prod.stock_quantity} (SKU: {prod.sku})
                </Typography>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No out of stock products.
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
