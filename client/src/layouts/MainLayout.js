import React from "react";
import styles from "./MainLayout.module.css";

const MainLayout = (props) => {
  return (
    <div>
      {/* The main content of the application is wrapped inside the 'main' element with the class 'styles.main'. */}
      {/* 'props.children' represents the content placed between the opening and closing tags of the 'MainLayout' component. */}
      <main className={styles.main}>{props.children}</main>
    </div>
  );
};

export default MainLayout;
