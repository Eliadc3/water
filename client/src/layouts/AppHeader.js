import React, { useState, useRef, useEffect } from "react";
import styles from "./AppHeader.module.css";
import img from "../img/water_logo.png";
import DropdownMenu from "../components/dropdown/DropdownMenu";

import Cookies from "js-cookie";

// AppHeader component provides a header section with a dropdown menu triggered by a button.
const AppHeader = ({ isAdmin, authenticated }) => {
  // Get the username from the cookie
  const username = Cookies.get("username");
  // State to manage the visibility of the dropdown menu.
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // Refs to access the dropdown element and the dropdown button element.
  const dropdownRef = useRef(null);
  const dropdownButtonRef = useRef(null);

  // Toggle the visibility of the dropdown menu.
  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  // Handle clicks outside the dropdown menu to close it.
  const handleOutsideClick = (event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target) &&
      dropdownButtonRef.current &&
      !dropdownButtonRef.current.contains(event.target)
    ) {
      setIsDropdownOpen(false);
    }
  };

  // Handle the click event on the dropdown button to toggle the dropdown.
  const handleDropdownButtonClick = (event) => {
    event.stopPropagation(); // Prevent event propagation to avoid closing the menu immediately after opening it.
    toggleDropdown();
  };

  // useEffect hook to add a click event listener when the component mounts and remove it when the component unmounts.
  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  // Function to close the dropdown menu.
  const closeMenu = () => {
    setIsDropdownOpen(false);
  };

  return (
    <header>
      <div className={styles.header}>
        {/* Render the image logo */}
        <img className={styles.img} src={img} alt="" />
        <div className={styles.rightHeader}>
          {/* Display the username and the dropdown button */}
          {username && (
            <div
              className={styles.dropdownButton}
              onClick={handleDropdownButtonClick}
              ref={dropdownButtonRef}
            >
              <i className="fa fa-bars" /> {/* Icon for the dropdown */}
              {username} {/* Display the username */}
            </div>
          )}
          {/* Render the dropdown menu */}
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
