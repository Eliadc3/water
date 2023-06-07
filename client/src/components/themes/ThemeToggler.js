import React, { useContext } from "react";
import { ThemeContext } from "./ThemeContext";
import styles from "./ThemeToggler.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";

const ThemeToggler = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div className={styles.themeToggler} onClick={toggleTheme}>
      <div
        className={`${styles.toggle} ${
          theme === "light" ? styles.dark : styles.light
        }`}
      >
        <div className={styles.notch}>
          <FontAwesomeIcon
            icon={theme === "light" ? faSun : faMoon}
            className={styles.icon}
          />
        </div>
      </div>
    </div>
  );
};

export default ThemeToggler;
