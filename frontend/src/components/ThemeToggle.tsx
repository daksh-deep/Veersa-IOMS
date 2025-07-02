import { useContext } from "react";
import { IconButton } from "@mui/material";
import { LightMode, DarkMode } from "@mui/icons-material";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";
import { ColorModeContext } from "../app/theme";

const ThemeToggle = () => {
  const mode = useSelector((state: RootState) => state.theme.mode);
  const colorMode = useContext(ColorModeContext);

  return (
    <IconButton onClick={colorMode.toggleColorMode} color="inherit">
      {mode === "dark" ? <LightMode /> : <DarkMode />}
    </IconButton>
  );
};

export default ThemeToggle;
