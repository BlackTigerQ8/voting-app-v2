import { createContext, useState, useMemo } from "react";
import { createTheme } from "@mui/material/styles";

// color design tokens
export const tokens = (mode) => ({
  ...(mode === "dark"
    ? {
        primary: {
          default: "#9AA6B2",
          light: "#D9EAFD",
        },
        secondary: {
          default: "#9AA6B2",
        },
        accent: {
          default: "#E38E49",
        },
        background: {
          default: "#F8FAFC",
        },
      }
    : {
        primary: {
          default: "#9AA6B2",
          light: "#D9EAFD",
        },
        secondary: {
          default: "#9AA6B2",
        },
        accent: {
          default: "#E38E49",
        },
        background: {
          default: "#F8FAFC",
          light: "#F8FAFC",
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
              main: colors.primary.default,
            },
            secondary: {
              main: colors.secondary.default,
            },
            accent: {
              main: colors.accent.default,
            },
            background: {
              default: colors.primary.default,
              paper: colors.background.default,
            },
          }
        : {
            primary: {
              main: colors.primary.default,
            },
            secondary: {
              main: colors.secondary.default,
            },
            accent: {
              main: colors.accent.default,
            },
            background: {
              default: colors.background.default,
            },
          }),
    },
  };
};

// context for color mode
export const ColorModeContext = createContext({
  toggleColorMode: () => {},
});

export const useMode = () => {
  const [mode, setMode] = useState("light");

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () =>
        setMode((prev) => (prev === "light" ? "dark" : "light")),
    }),
    []
  );

  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return [theme, colorMode];
};
