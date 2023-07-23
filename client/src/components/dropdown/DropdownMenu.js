import React, { useEffect } from "react";
import DropdownMenuStyles from "./DropdownMenu.module.css";
import Logout from "../authentication/Logout";
import { Link } from "react-router-dom";

const DropdownMenu = ({ isAdmin, authenticated, closeMenu }) => {
  // Define an array of link objects based on the isAdmin and authenticated props.
  const LINKS = [
    ...(isAdmin
      ? [
          {
            label: "Dashboard",
            path: "/dashboard",
          },
          {
            label: "Users",
            path: "/users",
          },
          {
            label: "Baseline",
            path: "/baseline",
          },
        ]
      : []),
    ...(authenticated
      ? [
          {
            label: "Logout",
            component: <Logout />,
          },
        ]
      : []),
  ];

  // useEffect hook to handle the click event on the links and close the menu.
  useEffect(() => {
    const handleLinkClick = () => {
      closeMenu(); // Call the closeMenu function to close the dropdown menu.
    };

    // Get all anchor elements inside the dropdown menu using the CSS module class name.
    const links = document.querySelectorAll(
      `.${DropdownMenuStyles.dropdownMenu} a`
    );
    // Add event listeners to each link to handle click events.
    links.forEach((link) => {
      link.addEventListener("click", handleLinkClick);
    });

    // Clean up function to remove event listeners when the component is unmounted.
    return () => {
      links.forEach((link) => {
        link.removeEventListener("click", handleLinkClick);
      });
    };
  }, [closeMenu]);

  return (
    <div>
      {/* Render the dropdown menu container */}
      <div className={DropdownMenuStyles.dropdownMenu}>
        <ul>
          {/* Map through the LINKS array and render each link or logout component */}
          {LINKS.map((link, index) => (
            <li key={index}>
              {link.component ? (
                // If the link has a component, render the component "Logout").
                <span className={DropdownMenuStyles.logoutLink}>
                  {link.component}
                </span>
              ) : (
                // If the link has a path, render a Link component (the link from the array).
                <Link className={DropdownMenuStyles.link} to={link.path}>
                  {link.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DropdownMenu;
