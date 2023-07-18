import React, { useState, useRef, useEffect } from "react";
import styles from "./AppHeader.module.css";
import img from "../img/water_logo.png";
import DropdownMenu from "../components/dropdown/DropdownMenu";

import Cookies from "js-cookie";

const AppHeader = ({ isAdmin, authenticated }) => {
  const firstName = Cookies.get("firstname");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };
  const handleOutsideClick = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  const handleDropdownButtonClick = (event) => {
    event.stopPropagation();
    toggleDropdown();
  };

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const closeMenu = () => {
    setIsDropdownOpen(false);
  };

  return (
    <header>
      <div className={styles.header}>
        <img className={styles.img} src={img} alt="" />
        <div className={styles.rightHeader}>
          {firstName}
          {firstName && (
            <span
              className={styles.dropdownButton}
              onClick={handleDropdownButtonClick}
            >
              <i className="fa fa-bars" />
            </span>
          )}
          <div ref={dropdownRef}>
            {isDropdownOpen && (
              <DropdownMenu
                isAdmin={isAdmin}
                authenticated={authenticated}
                closeMenu={closeMenu}
              />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
