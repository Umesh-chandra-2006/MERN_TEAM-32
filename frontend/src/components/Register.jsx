import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate, Link } from "react-router";
import { toast } from "react-hot-toast";

function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm({
    defaultValues: {
      role: "STUDENT"
    }
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const selectedRole = watch("role");

  const onRegister = async (newUser) => {
    setLoading(true);
    try {
      const apiPath = newUser.role === "STUDENT" ? "student-api" : "instructor-api";
      let response = await axios.post(
        `http://localhost:3000/${apiPath}/users`,
        newUser
      );

      if (response.status === 201) {
        toast.success("Registration successful! Please login.");
        navigate("/login");
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Registration failed. Please try again.";
      toast.error(msg);
      console.error("Error during registration: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-xl w-full space-y-8 bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-blue-50 border border-gray-100">
        <div>
          <h2 className="text-center text-4xl font-black text-gray-900 tracking-tight">
            Create Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-500 font-medium">
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-blue-600 hover:text-blue-500 transition-colors">
              Sign in here
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit(onRegister)} className="mt-8 space-y-6">
          {/* Role Selection Tabs */}
          <div className="flex p-1 bg-gray-100 rounded-2xl">
            <label className={`flex-1 flex items-center justify-center py-3 rounded-xl cursor-pointer transition-all ${selectedRole === "STUDENT" ? "bg-white shadow-sm text-blue-600 font-bold" : "text-gray-500 font-medium hover:text-gray-700"}`}>
              <input type="radio" value="STUDENT" {...register("role")} className="hidden" />
              Student
            </label>
            <label className={`flex-1 flex items-center justify-center py-3 rounded-xl cursor-pointer transition-all ${selectedRole === "INSTRUCTOR" ? "bg-white shadow-sm text-blue-600 font-bold" : "text-gray-500 font-medium hover:text-gray-700"}`}>
              <input type="radio" value="INSTRUCTOR" {...register("role")} className="hidden" />
              Instructor
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">First Name</label>
              <input
                type="text"
                {...register("firstName", { required: "Required", minLength: { value: 3, message: "Min 3 chars" } })}
                placeholder="John"
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium bg-gray-50/50"
              />
              {errors.firstName && <p className="text-red-500 text-[10px] font-bold ml-1">{errors.firstName.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">Last Name</label>
              <input
                type="text"
                {...register("lastName", { required: "Required", minLength: { value: 3, message: "Min 3 chars" } })}
                placeholder="Doe"
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium bg-gray-50/50"
              />
              {errors.lastName && <p className="text-red-500 text-[10px] font-bold ml-1">{errors.lastName.message}</p>}
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">Email Address</label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              placeholder="john@example.com"
              className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium bg-gray-50/50"
            />
            {errors.email && <p className="text-red-500 text-[10px] font-bold ml-1">{errors.email.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">Password</label>
            <input
              type="password"
              {...register("password", { required: "Required", minLength: { value: 6, message: "Min 6 chars" } })}
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium bg-gray-50/50"
            />
            {errors.password && <p className="text-red-500 text-[10px] font-bold ml-1">{errors.password.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">Profile Image URL (Optional)</label>
            <input
              type="text"
              {...register("profileImageUrl")}
              placeholder="https://example.com/photo.jpg"
              className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium bg-gray-50/50"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95 flex items-center justify-center ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
