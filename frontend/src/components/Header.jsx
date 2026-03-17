import React from "react";
import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../store/useAuth";
import logo from "../assets/app-logo.jpeg";
import { toast } from "react-hot-toast";

function Header() {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const defaultLinks = [
    { to: "/", label: "Home" },
    { to: "login", label: "Login" },
    { to: "register", label: "Register" },
  ];

  const roleLinks = {
    STUDENT: [
      { to: "/", label: "Home" },
      { to: "user-dashboard", label: "My Learning" },
    ],
    INSTRUCTOR: [
      { to: "/", label: "Home" },
      { to: "instructor-dashboard", label: "Instructor Panel" },
    ],
    ADMIN: [
      { to: "/", label: "Home" },
      { to: "admin-dashboard", label: "Admin Panel" },
    ],
  };

  const role = currentUser?.role;
  const navLinks = isAuthenticated && currentUser
    ? roleLinks[role] || []
    : defaultLinks;

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <NavLink to="/" className="flex items-center gap-2">
              <img
                className="h-10 w-10 rounded-lg object-cover"
                src={logo}
                alt="Logo"
              />
              <span className="text-xl font-bold text-gray-900 tracking-tight">SunStk</span>
            </NavLink>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-8">
            <ul className="flex items-center gap-6">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className={({ isActive }) =>
                      `text-sm font-medium transition-colors hover:text-blue-600 ${
                        isActive ? "text-blue-600" : "text-gray-600"
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <div className="flex items-center gap-4 ml-4 pl-4 border-l border-gray-200">
                <span className="text-sm text-gray-500 hidden sm:inline-block">
                  Hi, <span className="font-semibold text-gray-900">{currentUser.firstName}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-gray-900 text-white text-sm px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-all active:scale-95"
                >
                  Logout
                </button>
              </div>
            ) : null}
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;