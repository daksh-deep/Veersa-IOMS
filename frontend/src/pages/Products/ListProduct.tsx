import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  useTheme,
  Alert,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import type { GridPaginationModel, GridColDef } from "@mui/x-data-grid";
import { Edit } from "@mui/icons-material";
import axios from "axios";
import { useEffect, useState } from "react";
import UpdateProduct from "./UpdateProduct";
import SearchBar from "../../components/SearchBar";

interface Product {
  id: number;
  SKU: string;
  product_name: string;
  product_price: string;
  stock_quantity: number;
  isActive: boolean;
}

const ListProduct = () => {
  const theme = useTheme();
  const BASE_URL = "http://127.0.0.1:8000/api/";

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 5,
  });
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [shouldRefresh, setShouldRefresh] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await axios.get<Product[]>(BASE_URL + "product/");
      setProducts(res.data);
      setFilteredProducts(res.data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch products", err);
      setError("Failed to load products.");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [shouldRefresh]);

  const handleSearchResult = (data: Product | "reset" | null) => {
    if (data === "reset") {
      setFilteredProducts(products);
      setError(null);
      return;
    }

    if (data) {
      setFilteredProducts([data]);
      setError(null);
    } else {
      setFilteredProducts([]);
      setError("No product found with the given ID.");
    }
    setPaginationModel({ ...paginationModel, page: 0 });
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "sku", headerName: "SKU", flex: 1 },
    { field: "product_name", headerName: "Name", flex: 1.5 },
    { field: "product_price", headerName: "Price (₹)", flex: 1 },
    {
      field: "stock_quantity",
      headerName: "Stock",
      flex: 0.7,
      renderCell: (params) => (
        <Typography
          fontSize="1.05rem"
          mt={1.5}
          fontWeight={500}
          color={
            params.value === 0
              ? theme.palette.error.main
              : params.value <= 5
              ? theme.palette.warning.main
              : theme.palette.text.primary
          }
        >
          {params.value === 0
            ? "Out of Stock"
            : params.value <= 5
            ? `${params.value} (Low Stock)`
            : params.value}
        </Typography>
      ),
    },
    {
      field: "isActive",
      headerName: "Status",
      flex: 0.7,
      renderCell: (params) => (
        <Typography
          fontSize="1.05rem"
          mt={1.5}
          fontWeight={500}
          color={params.value ? theme.palette.success.main : theme.palette.error.main}
        >
          {params.value ? "Active" : "Inactive"}
        </Typography>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      flex: 0.8,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title="Edit Product">
          <IconButton
            onClick={() => setSelectedProductId(params.row.id)}
            color="primary"
          >
            <Edit />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  if (selectedProductId !== null) {
    return (
      <UpdateProduct
        id={selectedProductId}
        onClose={() => {
          setSelectedProductId(null);
          setShouldRefresh((prev) => !prev);
        }}
      />
    );
  }

  return (
    <Box m={3}>
      <Typography variant="h2" fontWeight={600} mb={3}>
        PRODUCTS
      </Typography>

      <Box mb={2}>
        <SearchBar
          placeholder="Search by Product ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          api={BASE_URL + "product/"}
          onResult={handleSearchResult}
        />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box
        sx={{
          height: 520,
          width: "100%",
          borderRadius: 2,
          overflow: "hidden",
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <DataGrid
          rows={filteredProducts}
          columns={columns}
          getRowId={(row) => row.id}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10]}
          disableRowSelectionOnClick
          sx={{
            fontSize: "1.1rem",
            border: 0,
            color: theme.palette.text.primary,
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: theme.palette.primary.light,
              fontSize: "1.15rem",
              fontWeight: "bold",
            },
            "& .MuiDataGrid-footerContainer": {
              fontSize: "1.1rem",
            },
            "& .MuiDataGrid-cell": {
              fontSize: "1.1rem",
            },
            "& .MuiTablePagination-root": {
              fontSize: "1.05rem",
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default ListProduct;
