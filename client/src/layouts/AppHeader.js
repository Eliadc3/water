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
        <ul>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/register">Create User</Link>
          </li>
          <li>
            <Link to="/uploadfile">Upload File</Link>
          </li>
          <li>
            <Link to="/graph">Graph</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default AppHeader;
