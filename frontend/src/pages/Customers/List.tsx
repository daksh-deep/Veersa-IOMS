import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Fab,
  useTheme,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import type { GridPaginationModel, GridColDef } from "@mui/x-data-grid";
import { Edit } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { useEffect, useState } from "react";
import Update from "./Update";
import Create from "./Create";

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  isActive: boolean;
}

const List = () => {
  const theme = useTheme();
  const BASE_URL = "http://127.0.0.1:8000/api/";

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 5,
  });
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [shouldRefresh, setShouldRefresh] = useState(false);

  const fetchCustomers = async () => {
    try {
      const res = await axios.get<Customer[]>(BASE_URL + "customer/");
      setCustomers(res.data);
    } catch (err) {
      console.error("Failed to fetch customers", err);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [shouldRefresh]);

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
      flex: 0.6,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title="Edit Customer">
          <IconButton
            onClick={() => setSelectedCustomerId(params.row.id)}
            color="primary"
          >
            <Edit />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  // Render Update View
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

  // Render Create View
  if (isCreating) {
    return (
      <Create
        onClose={() => {
          setIsCreating(false);
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
          rows={customers}
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

      {/* Floating Add Button */}
      <Fab
        color="secondary"
        aria-label="add"
        onClick={() => setIsCreating(true)}
        sx={{
          position: "fixed",
          bottom: 90,
          right: 24,
          backgroundColor: theme.palette.secondary.main,
          color: theme.palette.getContrastText(theme.palette.secondary.main),
          "&:hover": {
            backgroundColor: theme.palette.secondary.dark,
          },
        }}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};

export default List;
