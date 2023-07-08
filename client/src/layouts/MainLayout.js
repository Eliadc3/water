import React, { useContext } from "react";
import styles from "./MainLayout.module.css";
import { ThemeContext } from "../components/themes/ThemeContext";
import ThemeToggler from "../components/themes/ThemeToggler";

const MainLayout = (props) => {
  const { theme } = useContext(ThemeContext);
  return (
    <div className={`${theme}-theme`}>
      <ThemeToggler />
      <main className={styles.main}>{props.children}</main>
    </div>
  );
};

export default MainLayout;
