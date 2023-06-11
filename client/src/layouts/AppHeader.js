import React, { useContext } from "react";
import { Link } from "react-router-dom";
import styles from "./AppHeader.module.css";
import img from "../img/water_logo.png";
import { ThemeContext } from "../components/themes/ThemeContext";
import Logout from "../components/Authentication/Logout";

const AppHeader = () => {
  const { theme } = useContext(ThemeContext);
  console.log(theme);
  const LINKS = [
    { label: "login", path: "/login" },
    { label: "register", path: "/register" },
    { label: "dashboard", path: "/dashboard" },
  ];
  return (
    <header className={styles.header}>
      <img className={styles.img} src={img} alt="" />

      <nav>
        <ul>
          {LINKS.map((e) => (
            <li key={e.path}>
              <Link
                style={{ color: theme === "dark" ? "#F8F6F4" : "#454545" }}
                to={e.path}
              >
                {e.label}
              </Link>
            </li>
          ))}
          <Logout />
        </ul>
      </nav>
    </header>
  );
};

export default AppHeader;
