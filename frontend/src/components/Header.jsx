import React from "react";
import { NavLink } from "react-router";
import { useAuth } from "../store/useAuth";

function Header() {
  const { currentUser, isAuthenticated } = useAuth();

  const defaultLinks = [
    { to: "", label: "Home", bold: true },
    { to: "login", label: "Login" },
    { to: "register", label: "Register" },
  ];

  const roleLinks = {
    STUDENT: [
      { to: "", label: "Home", bold: true },
      { to: "courses", label: "Courses" },
      { to: "mylearning", label: "My Learning" },
    ],
    INSTRUCTOR: [
      { to: "", label: "Home", bold: true },
      { to: "mycourses", label: "My Courses" },
      { to: "logout", label: "Logout" },
    ],
    ADMIN: [
      { to: "", label: "Home", bold: true },
      { to: "users", label: "Users" },
      { to: "instructors", label: "Instructors" },
      { to: "logout", label: "Logout" },
    ],
  };

  const role = currentUser?.role;
  const isLoggedIn = isAuthenticated && !!currentUser;

  const navLinks = isLoggedIn
    ? roleLinks[role] ?? roleLinks.STUDENT
    : defaultLinks;

  const getLinkClass = (isActive) =>
    `transition-colors duration-200 ${
      isActive
        ? "text-gray-900 font-semibold"
        : "text-gray-600 hover:text-gray-900"
    }`;

  return (
    <header className="flex flex-col sm:flex-row justify-between items-center px-6 sm:px-12 py-3 bg-gray-100 border-b border-gray-200 gap-4 sm:gap-0">
      
      {/* Logo */}
      <img
        width="60"
        src="https://png.pngtree.com/png-clipart/20220509/original/pngtree-brain-logo-design-for-educational-png-image_7667200.png"
        alt="logo"
        className="opacity-90"
      />

      {/* Nav */}
      <nav>
        <ul className="flex flex-col sm:flex-row items-center gap-4 sm:gap-10 text-lg">
          {navLinks.map((link) => (
            <li key={link.to || link.label}>
              <NavLink
                to={link.to}
                className={({ isActive }) => getLinkClass(isActive)}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

    </header>
  );
}

export default Header;