import React, { useEffect } from "react";
import { useAuth } from "../store/useAuth";
import { useNavigate } from "react-router";

function Logout() {
  const logout = useAuth((state) => state.logout);
  const navigate = useNavigate();

  useEffect(() => {
    const doLogout = async () => {
      await logout();
      navigate("/login"); // redirect to home after logout
    };

    doLogout();
  }, []);

  return <div>Logging out...</div>;
}

export default Logout;