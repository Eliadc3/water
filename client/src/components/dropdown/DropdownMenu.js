import React, { useContext } from "react";
import { Link } from "react-router-dom";
import DropdownMenuStyles from "./DropdownMenu.module.css";
import ThemeToggler from "../themes/ThemeToggler";
import { ThemeContext } from "../themes/ThemeContext";
import Logout from "../authentication/Logout";

const DropdownMenu = ({ isAdmin, authenticated }) => {
  const { theme } = useContext(ThemeContext);

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
                  color: theme === "dark" ? "#F8F6F4" : "#2d363c",
                }}
                to={link.path}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <ThemeToggler />
          </li>
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
