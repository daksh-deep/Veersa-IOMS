import { CssBaseline, ThemeProvider } from "@mui/material";
import { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Routes, Route } from "react-router-dom";
import type { RootState } from "./app/store";
import { toggleMode } from "./features/theme/themeSlice";
import { themeSettings, ColorModeContext } from "./app/theme";
import ThemeToggle from "./components/ThemeToggle";

import List from "./pages/Customers/List";

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
        <ThemeToggle />
        <Routes>
          <Route path="/customers" element={<List />} />
          {/* You can add more routes here like */}
          {/* <Route path="/customers/:id" element={<CustomerDetails />} /> */}
        </Routes>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
