import React from "react";
import { Link } from "react-router-dom";
import styles from "./AppHeader.module.css";
import img from "../img/water_logo.png";

const AppHeader = () => {
  return (
    <header className={styles.header}>
      <img className={styles.img} src={img} alt="" />
      Water analysis
      <nav>
        <div>
          <ul>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/logout">Logout</Link>
            </li>
            <li>
              <Link to="/register">Create User</Link>
            </li>

            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default AppHeader;
