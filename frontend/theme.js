import { createContext, useState, useMemo } from "react";
import { createTheme } from "@mui/material/styles";

// color design tokens
export const tokens = (mode) => ({
  ...(mode === "dark"
    ? {
        black: {
          100: "#d3d4d6",
          200: "#a7a9ad",
          300: "#7a7e83",
          400: "#4e535a",
          500: "#222831",
          600: "#1b2027",
          700: "#14181d",
          800: "#0e1014",
          900: "#07080a",
        },
        grey: {
          100: "#d7d8da",
          200: "#b0b2b5",
          300: "#888b90",
          400: "#61656b",
          500: "#393e46",
          600: "#2e3238",
          700: "#22252a",
          800: "#17191c",
          900: "#0b0c0e",
        },
        yellow: {
          100: "#fff6e1",
          200: "#ffedc3",
          300: "#ffe5a5",
          400: "#ffdc87",
          500: "#ffd369",
          600: "#cca954",
          700: "#997f3f",
          800: "#66542a",
          900: "#332a15",
        },
        white: {
          100: "#fcfcfc",
          200: "#f8f8f8",
          300: "#f5f5f5",
          400: "#f1f1f1",
          500: "#eeeeee",
          600: "#bebebe",
          700: "#8f8f8f",
          800: "#5f5f5f",
          900: "#303030",
        },
      }
    : {
        black: {
          900: "#d3d4d6",
          800: "#a7a9ad",
          700: "#7a7e83",
          600: "#4e535a",
          500: "#222831",
          400: "#1b2027",
          300: "#14181d",
          200: "#0e1014",
          100: "#07080a",
        },
        grey: {
          900: "#d7d8da",
          800: "#b0b2b5",
          700: "#888b90",
          600: "#61656b",
          500: "#393e46",
          400: "#2e3238",
          300: "#22252a",
          200: "#17191c",
          100: "#0b0c0e",
        },
        yellow: {
          900: "#fff6e1",
          800: "#ffedc3",
          700: "#ffe5a5",
          600: "#ffdc87",
          500: "#ffd369",
          400: "#cca954",
          300: "#997f3f",
          200: "#66542a",
          100: "#332a15",
        },
        white: {
          900: "#fcfcfc",
          800: "#f8f8f8",
          700: "#f5f5f5",
          600: "#f1f1f1",
          500: "#eeeeee",
          400: "#bebebe",
          300: "#8f8f8f",
          200: "#5f5f5f",
          100: "#303030",
        },
      }),
});

// mui theme settings
export const themeSettings = (mode) => {
  const colors = tokens(mode);
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            primary: {
              main: colors.yellow[500],
            },
            secondary: {
              main: colors.grey[500],
            },
            neutral: {
              dark: colors.black[500],
              main: colors.grey[500],
              light: colors.white[500],
            },
            background: {
              default: colors.black[500],
              paper: colors.black[400],
            },
            text: {
              primary: colors.white[500],
              secondary: colors.grey[500],
              disabled: colors.grey[600],
            },
            divider: colors.grey[500],
          }
        : {
            primary: {
              main: colors.yellow[500],
            },
            secondary: {
              main: colors.grey[500],
            },
            neutral: {
              dark: colors.black[500],
              main: colors.grey[500],
              light: colors.white[500],
            },
            background: {
              default: colors.white[500],
              paper: colors.white[400],
            },
            text: {
              primary: colors.black[500],
              secondary: colors.grey[500],
              disabled: colors.grey[400],
            },
            divider: colors.grey[200],
          }),
    },
    typography: {
      fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
      fontSize: 12,
      h1: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 40,
      },
      h2: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 32,
      },
      h3: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 24,
      },
      h4: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 20,
      },
      h5: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 16,
      },
      h6: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 14,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            borderRadius: 8,
          },
          contained: {
            boxShadow: "none",
            "&:hover": {
              boxShadow: "none",
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            boxShadow: "none",
            borderRadius: 8,
          },
        },
      },
    },
  };
};

// context for color mode
export const ColorModeContext = createContext({
  toggleColorMode: () => {},
});

export const useMode = () => {
  const [mode, setMode] = useState("dark");

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () =>
        setMode((prev) => (prev === "dark" ? "light" : "dark")),
    }),
    []
  );

  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return [theme, colorMode];
};
