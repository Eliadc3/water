import React from "react";
import styles from "./Card.module.css";

// Card component takes 'props' as its parameter.
const Card = (props) => {
  // The 'props' parameter allows the component to receive and access any content placed between its opening and closing tags.
  // 'props.children' represents the content within the Card component.

  return (
    <div className={styles.card}>
      {/* The 'props.children' are rendered inside the Card div. */}
      {props.children}
    </div>
  );
};

// This component in use in the Dashboard Page.
export default Card;
