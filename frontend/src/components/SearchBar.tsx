import { Paper, InputBase, Divider, IconButton } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import axios from "axios";

interface Props {
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  api: string; // base API endpoint like "http://127.0.0.1:8000/api/customer/"
  onResult: (data: any | null) => void; // result of the fetch
  width?: number | string;
}

export default function SearchBar({
  placeholder = "Search...",
  value,
  onChange,
  api,
  onResult,
  width = 400,
}: Props) {
  const handleSearch = async () => {
    if (!value.trim()) {
      onResult("reset");
      return;
    }
    try {
      const res = await axios.get(`${api}${value}`);
      onResult(res.data);
    } catch (err) {
      console.error("Search failed", err);
      onResult(null);
    }
  };

  return (
    <Paper
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
        handleSearch();
      }}
      sx={{
        p: "2px 8px",
        display: "flex",
        alignItems: "center",
        width,
        borderRadius: 2,
        backgroundColor: "background.paper",
      }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        inputProps={{ "aria-label": placeholder }}
      />
      <Divider sx={{ height: 28, mx: 1 }} orientation="vertical" />
      <IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
        <SearchIcon />
      </IconButton>
    </Paper>
  );
}
