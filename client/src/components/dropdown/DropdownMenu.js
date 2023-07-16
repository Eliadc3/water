import React, { useContext } from "react";
import { Link } from "react-router-dom";
import DropdownMenuStyles from "./DropdownMenu.module.css";
import Logout from "../authentication/Logout";

const DropdownMenu = ({ isAdmin, authenticated }) => {
  const LINKS = [
    ...(isAdmin
      ? [
          { label: "Dashboard", path: "/dashboard" },
          { label: "Users", path: "/users" },
          { label: "Baseline", path: "/baseline" },
        ]
      : []),
  ];
  return (
    <div>
      <div className={DropdownMenuStyles.dropdownMenu}>
        <ul>
          {LINKS.map((link, index) => (
            <li key={index}>
              <Link
                style={{
                  color: "#F8F6F4",
                }}
                to={link.path}
              >
                {link.label}
              </Link>
            </li>
          ))}

          {authenticated && (
            <li>
              <Logout />
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default DropdownMenu;
