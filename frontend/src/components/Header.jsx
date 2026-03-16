import React from "react";
import { NavLink } from "react-router";
import { useAuth } from "../store/useAuth";
import logo from "../assets/logo.png";

function Header() {
  const { currentUser, isAuthenticated } = useAuth();

  const defaultLinks = [
    { to: "", label: "Home", bold: true },
    { to: "login", label: "Login" },
    { to: "register", label: "Register" },
  ];

  const roleLinks = {
    USER: [
      { to: "", label: "Home", bold: true },
      { to: "courses", label: "Courses" },
      { to: "mylearning", label: "My Learning" },
    ],
    INSTRUCTOR: [
      { to: "", label: "Home", bold: true },
      { to: "mycourses", label: "My Courses" },
    ],
    ADMIN: [
      { to: "", label: "Home", bold: true },
      { to: "users", label: "users" },
      { to: "instructors", label: "Instructors" },
    ],
  };

  const role = currentUser?.role;
  const isLoggedIn = isAuthenticated && !!currentUser;
  const navLinks = isLoggedIn
    ? (roleLinks[role] ?? roleLinks.USER)
    : defaultLinks;

  const getLinkClass = (isActive, bold = false) => {
    if (!isActive) return "";
    return bold ? "bg-auto text-blue-500 font-bold" : "text-blue-500";
  };

  return (
    <div className=" flex justify-between items-center bg-gray-700 px-10 py-2">
      <img
        width="85px"
        src={logo}
        alt="logo"
      />
      <nav>
        <ul className="flex gap-10 text-2xl">
          {navLinks.map((link) => (
            <li key={link.to || link.label}>
              <NavLink
                to={link.to}
                className={({ isActive }) => getLinkClass(isActive, link.bold)}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default Header;
