import { createTheme } from "@mui/material/styles";
import { createContext } from "react";

export const tokens = (mode: "light" | "dark") => ({
  ...(mode === "dark"
    ? {
        grey: {
          100: "#e0e0e0",
          200: "#c2c2c2",
          300: "#a3a3a3",
          400: "#858585",
          500: "#666666",
          600: "#4d4d4d",
          700: "#333333",
          800: "#1a1a1a",
          900: "#000000", // Pitch black
        },
        primary: {
          100: "#fff9cc",
          200: "#fff399",
          300: "#ffed66",
          400: "#ffe733",
          500: "#ffdf00", // Pure Yellow
          600: "#ccb200",
          700: "#998500",
          800: "#665800",
          900: "#332c00",
        },
        secondary: {
          100: "#fff7cc",
          200: "#ffee99",
          300: "#ffe566",
          400: "#ffdc33",
          500: "#ffd300", // Bright Gold Yellow
          600: "#cca900",
          700: "#997f00",
          800: "#665500",
          900: "#332a00",
        },
        background: {
          default: "#000000",
          paper: "#0a0a0a",
        },

      }
    : {
        grey: {
          100: "#1a1a1a",
          200: "#2e2e2e",
          300: "#444444",
          400: "#666666",
          500: "#808080",
          600: "#999999",
          700: "#b3b3b3",
          800: "#cccccc",
          900: "#f5f5f5",
        },
        primary: {
          100: "#fff9cc",
          200: "#fff399",
          300: "#ffed66",
          400: "#ffe733",
          500: "#ffdf00", // Yellow
          600: "#ccb200",
          700: "#998500",
          800: "#665800",
          900: "#332c00",
        },
        secondary: {
          100: "#fff9cc",
          200: "#fff099",
          300: "#ffe666",
          400: "#ffdc33",
          500: "#ffd300", // Yellow-gold
          600: "#ccaa00",
          700: "#998000",
          800: "#665600",
          900: "#332b00",
        },
        background: {
          default: "#fefefe",
          paper: "#ffffff",
        },
      }),
});

export const themeSettings = (mode: "light" | "dark") => {
  const colors = tokens(mode);

  return createTheme({
    palette: {
      mode,
      primary: { main: colors.primary[500] },
      secondary: { main: colors.secondary[500] },
      neutral: {
        main: colors.grey[500],
        light: colors.grey[100],
        dark: colors.grey[700],
      },
      background: {
        default: colors.background.default,
        paper: colors.background.paper,
      },
    },
    typography: {
      fontFamily: ["JetBrains Mono", "Roboto", "monospace"].join(","),
      fontSize: 14,
      h1: { fontSize: 40, fontWeight: 700 },
      h2: { fontSize: 32, fontWeight: 600 },
      h3: { fontSize: 26, fontWeight: 600 },
      h4: { fontSize: 22, fontWeight: 500 },
      h5: { fontSize: 18, fontWeight: 500 },
      h6: { fontSize: 16, fontWeight: 500 },
      button: { textTransform: "none", fontWeight: 500 },
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 10,
          },
        },
      },
    },
  });
};

export const ColorModeContext = createContext({ toggleColorMode: () => {} });

declare module "@mui/material/styles" {
  interface Palette {
    neutral: {
      main: string;
      light: string;
      dark: string;
    };
  }
  interface PaletteOptions {
    neutral?: {
      main: string;
      light: string;
      dark: string;
    };
  }
}
