import React, { useState, createContext, useEffect } from "react";

const ThemeContext = createContext();

const ThemeProvider = ({ defaultTheme, children }) => {
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

  const themeContextValue = {
    theme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={themeContextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeContext, ThemeProvider };
