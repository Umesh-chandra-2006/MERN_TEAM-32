import React from "react";
import { useAuth } from "../store/useAuth";

function AdminDashboard() {
  const currentUser = useAuth();
  console.log(currentUser.currentUser);
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>

      <p>Welcome, Admin {currentUser.currentUser.firstName}!</p>
    </div>
  );
}

export default AdminDashboard;
    