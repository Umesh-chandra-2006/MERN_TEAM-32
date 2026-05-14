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
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl backdrop-saturate-150 shadow-[0_18px_50px_-28px_rgba(15,23,42,0.35)]">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <NavLink to="/" className="group flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border border-white/70 bg-slate-950 text-white shadow-lg shadow-slate-950/20 ring-1 ring-slate-200/80">
            <img className="h-full w-full object-cover" src={logo} alt="Logo" />
          </div>
          <div className="leading-tight">
            <span className="block text-lg font-black tracking-tight text-slate-950">SunStk</span>
            <span className="block text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">Learn without friction</span>
          </div>
        </NavLink>

        <nav className="flex items-center gap-4">
          <ul className="hidden items-center gap-2 rounded-full border border-slate-200/80 bg-white/80 p-1 shadow-sm md:flex">
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                      isActive
                        ? "bg-slate-950 text-white shadow-md shadow-slate-950/15"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-2 py-2 pr-3 shadow-sm transition-transform hover:-translate-y-0.5"
              >
                <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-slate-900 to-blue-700 text-xs font-black text-white ring-2 ring-white">
                  {currentUser.profileImageUrl ? (
                    <img src={currentUser.profileImageUrl} alt="Avatar" className="h-full w-full object-cover" />
                  ) : (
                    <span>{currentUser.firstName?.[0]}{currentUser.lastName?.[0]}</span>
                  )}
                </div>
                <div className="hidden text-left sm:block">
                  <p className="text-xs font-bold text-slate-500">Signed in</p>
                  <p className="max-w-32 truncate text-sm font-semibold text-slate-950">{currentUser.firstName} {currentUser.lastName}</p>
                </div>
                <svg className={`h-4 w-4 text-slate-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-64 overflow-hidden rounded-3xl border border-slate-200 bg-white p-2 shadow-2xl shadow-slate-950/10 animate-in fade-in zoom-in duration-200">
                  <div className="rounded-2xl bg-slate-950 px-4 py-3 text-white">
                    <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-slate-300">Account</p>
                    <p className="mt-1 truncate text-sm font-semibold">{currentUser.firstName} {currentUser.lastName}</p>
                    <p className="text-xs text-slate-400">{currentUser.role}</p>
                  </div>

                  <NavLink
                    to="/profile"
                    onClick={() => setIsDropdownOpen(false)}
                    className="mt-2 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-950"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    My Profile
                  </NavLink>

                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-50"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <NavLink to="/login" className="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950">Login</NavLink>
              <NavLink to="/register" className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-slate-950/15 transition-transform hover:-translate-y-0.5">Register</NavLink>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;