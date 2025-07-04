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
import Update from "./UpdateCustomer";
import SearchBar from "../../components/SearchBar";

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  isActive: boolean;
}

const ListCustomer = () => {
  const theme = useTheme();
  const BASE_URL = "http://127.0.0.1:8000/api/";

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 5,
  });
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  const [shouldRefresh, setShouldRefresh] = useState(false);
  const fetchCustomers = async () => {
    try {
      const res = await axios.get<Customer[]>(BASE_URL + "customer/");
      setCustomers(res.data);
      setFilteredCustomers(res.data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch customers", err);
      setError("Failed to load customers.");
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [shouldRefresh]);

  const handleSearchResult = (data: Customer | "reset" | null) => {
    if (data === "reset") {
      setFilteredCustomers(customers);
      setError(null);
      return;
    }

    if (data) {
      setFilteredCustomers([data]);
      setError(null);
    } else {
      setFilteredCustomers([]);
      setError("No customer found with the given ID.");
    }

    setPaginationModel({ ...paginationModel, page: 0 });
  };


  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1.5 },
    { field: "phone", headerName: "Phone", flex: 1 },
    { field: "address", headerName: "Address", flex: 2 },
    {
      field: "isActive",
      headerName: "Status",
      flex: 0.7,
      renderCell: ({ value }) => (
        <Typography
          fontSize="1.05rem"
          mt={1.5}
          fontWeight={500}
          color={value ? theme.palette.success.main : theme.palette.error.main}
        >
          {value ? "Active" : "Inactive"}
        </Typography>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      flex: 0.5,
      align: "center",
      headerAlign: "center",
      renderCell: ({ row }) => (
        <Tooltip title="Edit Customer">
          <IconButton
            onClick={() => setSelectedCustomerId(row.id)}
            color="primary"
          >
            <Edit />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  if (selectedCustomerId !== null) {
    return (
      <Update
        id={selectedCustomerId}
        onClose={() => {
          setSelectedCustomerId(null);
          setShouldRefresh((prev) => !prev);
        }}
      />
    );
  }

  return (
    <Box m={3}>
      <Typography variant="h2" fontWeight={600} mb={3}>
        CUSTOMERS
      </Typography>

      <Box mb={2}>
        <SearchBar
          placeholder="Search by Customer ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          api={BASE_URL + "customer/"}
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
          rows={filteredCustomers}
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

export default ListCustomer;
