import React from "react";
import { NavLink } from "react-router";
import { useAuth } from "../store/useAuth";

function Header() {
  const currentUser = useAuth().currentUser;

  return (
    <div className=" flex justify-between items-center bg-gray-700 px-10 py-2">
      <img
        width="85px"
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5I7ARthR47U9r6rQr0j3crdCBwrdO87bLMw&s"
        alt="logo"
        className="rounded-[50px]"
      />
      <nav>
        <ul className="flex gap-10 text-2xl">
          <li>
            <NavLink
              to=""
              className={({ isActive }) =>
                isActive ? "bg-auto text-blue-500 font-bold" : ""
              }
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="login"
              className={({ isActive }) => (isActive ? "text-blue-500" : "")}
            >
              Login
            </NavLink>
          </li>
          <li>
            <NavLink
              to="register"
              className={({ isActive }) => (isActive ? "text-blue-500" : "")}
            >
              Register
            </NavLink>
          </li>
          {currentUser && (
            <li>
              <NavLink
                to="user-profile"
                className={({ isActive }) => (isActive ? "text-blue-500" : "")}
              >
                Profile
              </NavLink>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
}

export default Header;
