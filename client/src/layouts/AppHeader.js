import React, { useState } from "react";
import styles from "./AppHeader.module.css";
import img from "../img/water_logo.png";
import DropdownMenu from "../components/dropdown/DropdownMenu";
// import DropdownMenuStyles from "../components/dropdown/DropdownMenu.module.css";

import Cookies from "js-cookie";

const AppHeader = ({ isAdmin, authenticated }) => {
  const firstName = Cookies.get("firstname");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  return (
    <header>
      <div className={styles.header}>
        <img className={styles.img} src={img} alt="" />
        <div className={styles.rightHeader}>
          {firstName}
          {firstName && (
            <span className={styles.dropdownButton} onClick={toggleDropdown}>
              <i className="fa fa-bars" />
            </span>
          )}
          <div>
            {isDropdownOpen && (
              <DropdownMenu isAdmin={isAdmin} authenticated={authenticated} />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
