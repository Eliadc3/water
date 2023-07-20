import React, { useEffect } from "react";
import DropdownMenuStyles from "./DropdownMenu.module.css";
import Logout from "../authentication/Logout";
import { Link } from "react-router-dom";

const DropdownMenu = ({ isAdmin, authenticated, closeMenu }) => {
  const LINKS = [
    ...(isAdmin
      ? [
          { label: "Dashboard", path: "/dashboard" },
          { label: "Users", path: "/users" },
          { label: "Baseline", path: "/baseline" },
        ]
      : []),
    ...(authenticated ? [{ label: "Logout", component: <Logout /> }] : []),
  ];

  useEffect(() => {
    const handleLinkClick = () => {
      closeMenu();
    };

    const links = document.querySelectorAll(
      `.${DropdownMenuStyles.dropdownMenu} a`
    );
    links.forEach((link) => {
      link.addEventListener("click", handleLinkClick);
    });

    return () => {
      links.forEach((link) => {
        link.removeEventListener("click", handleLinkClick);
      });
    };
  }, [closeMenu]);

  return (
    <div>
      <div className={DropdownMenuStyles.dropdownMenu}>
        <ul>
          {LINKS.map((link, index) => (
            <li key={index}>
              {link.component ? (
                <span className={DropdownMenuStyles.logoutLink}>
                  {link.component}
                </span>
              ) : (
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
