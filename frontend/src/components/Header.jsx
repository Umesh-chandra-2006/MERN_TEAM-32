import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../store/useAuth";
import logo from "../assets/app-logo.jpeg";
import { toast } from "react-hot-toast";

function Header() {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    setIsDropdownOpen(false);
    navigate("/login");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

            {/* Profile Dropdown */}
            {isAuthenticated ? (
              <div className="relative ml-4 pl-4 border-l border-gray-200" ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 group focus:outline-none"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-black shadow-lg shadow-blue-100 group-hover:scale-105 transition-transform overflow-hidden border-2 border-white">
                    {currentUser.profileImageUrl ? (
                      <img src={currentUser.profileImageUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span>{currentUser.firstName?.[0]}{currentUser.lastName?.[0]}</span>
                    )}
                  </div>
                  <svg 
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} 
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-gray-50 py-2 z-50 animate-in fade-in zoom-in duration-200">
                    <div className="px-4 py-3 border-b border-gray-50 mb-1">
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Signed in as</p>
                      <p className="text-sm font-bold text-gray-900 truncate">{currentUser.firstName} {currentUser.lastName}</p>
                    </div>
                    
                    <NavLink 
                      to="/profile" 
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      My Profile
                    </NavLink>
                    
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors border-t border-gray-50 mt-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : null}
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;