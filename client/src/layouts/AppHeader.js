import React, { useContext } from "react";
import { Link } from "react-router-dom";
import styles from "./AppHeader.module.css";
import img from "../img/water_logo.png";
import { ThemeContext } from "../components/themes/ThemeContext";
import Logout from "../components/authentication/Logout";

const AppHeader = ({ isAdmin, authenticated }) => {
  const { theme } = useContext(ThemeContext);
  const LINKS = [
    ...(authenticated ? [{ label: "dashboard", path: "/dashboard" }] : []),
    ...(isAdmin
      ? [
          { label: "users", path: "/users" },
          { label: "Baseline", path: "/baseline" },
        ]
      : []),
    { label: "login", path: "/login" },
  ];

  return (
    <header className={styles.header}>
      <img className={styles.img} src={img} alt="" />

      <nav>
        <ul>
          {LINKS.map((e) => (
            <li key={e.path}>
              <Link
                style={{
                  color: theme === "dark" ? "#F8F6F4" : "#454545",
                }}
                to={e.path}
              >
                {e.label}
              </Link>
            </li>
          ))}
          {authenticated && <Logout />}
        </ul>
      </nav>
    </header>
  );
};

export default AppHeader;
