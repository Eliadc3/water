import React from "react";
import styles from "./MainLayout.module.css";
import ThemeToggler from "../components/themes/ThemeToggler";

const MainLayout = (props) => {
  return (
    <div>
      {/* <ThemeToggler /> */}
      <main className={styles.main}>{props.children}</main>
    </div>
  );
};

export default MainLayout;
