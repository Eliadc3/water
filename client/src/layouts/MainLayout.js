import React from "react";
import styles from "./MainLayout.module.css";

const MainLayout = (props) => {
  return (
    <div>
      <main className={styles.main}>{props.children}</main>
    </div>
  );
};

export default MainLayout;
