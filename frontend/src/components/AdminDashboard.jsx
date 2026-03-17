import React from "react";
import { useAuth } from "../store/useAuth";

function AdminDashboard() {
  const { currentUser } = useAuth();
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">System overview and management panel.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Welcome, {currentUser?.firstName}!</h2>
            <p className="text-gray-500">Administrator</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Total Students", value: "1,234", color: "blue" },
            { label: "Total Instructors", value: "56", color: "indigo" },
            { label: "Active Courses", value: "89", color: "emerald" },
          ].map((stat) => (
            <div key={stat.label} className="p-6 rounded-2xl bg-gray-50 border border-gray-100">
              <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
              <p className="text-3xl font-black text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center p-12 border-2 border-dashed border-gray-100 rounded-3xl">
           <p className="text-gray-400 italic">Admin management features (Users, Courses, Reports) coming soon...</p>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
    