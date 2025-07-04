// App.tsx
import { CssBaseline, ThemeProvider } from "@mui/material";
import { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";
import type { RootState } from "./app/store";
import { toggleMode } from "./features/theme/themeSlice";
import { themeSettings, ColorModeContext } from "./app/theme";
import CreateProduct from "./pages/Products/CreateProduct";
import PrivateRoute from "./components/PrivateRoute";

// Pages
import Login from "./pages/Login/Login";
import Sidebar from "./pages/Sidebar/Sidebar";
import Dashboard from "./pages/Dashboard/Dashboard";
import ListCustomer from "./pages/Customers/ListCustomer";
import ListProduct from "./pages/Products/ListProduct";
import CreateOrder from "./pages/Orders/Create";
import CreateCustomer from "./pages/Customers/CreateCustomer";
import ListOrder from "./pages/Orders/ListOrder";

function App() {
  const mode = useSelector((state: RootState) => state.theme.mode);
  const dispatch = useDispatch();
  const theme = useMemo(() => themeSettings(mode), [mode]);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => dispatch(toggleMode()),
    }),
    [dispatch]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Sidebar>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/customers"
              element={
                <PrivateRoute>
                  <ListCustomer />
                </PrivateRoute>
              }
            />
            <Route
              path="/products"
              element={
                <PrivateRoute>
                  <ListProduct />
                </PrivateRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <PrivateRoute>
                  <ListOrder />
                </PrivateRoute>
              }
            />
            <Route
              path="/create-customer"
              element={
                <PrivateRoute>
                  <CreateCustomer onClose={() => { }} />
                </PrivateRoute>
              }
            />
            <Route
              path="/create-product"
              element={
                <PrivateRoute>
                  <CreateProduct onClose={() => { }} />
                </PrivateRoute>
              }
            />
            <Route
              path="/create-order"
              element={
                <PrivateRoute>
                  <CreateOrder onClose={() => { }} />
                </PrivateRoute>
              }
            />

            {/* Default redirect */}
            <Route path="*" element={<Navigate to="/dashboard" />} />
            
          </Routes>
        </Sidebar>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
