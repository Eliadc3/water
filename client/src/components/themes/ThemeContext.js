import React, { useState, createContext, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
const ThemeContext = createContext();

const ThemeProviderWrapper = ({ defaultTheme, children }) => {
  const [theme, setTheme] = useState(getSavedTheme || defaultTheme);

  useEffect(() => {
    // Save the selected theme to local storage
    localStorage.setItem("theme", theme);
  }, [theme]);

  function getSavedTheme() {
    // Retrieve the theme from local storage
    return localStorage.getItem("theme");
  }
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const muiTheme = createTheme({
    palette: {
      mode: theme,
    },
    style: {
      fontsize: "12px",
    },
  });

  const themeContextValue = {
    theme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={themeContextValue}>
      <ThemeProvider theme={muiTheme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};

export { ThemeContext, ThemeProviderWrapper };
