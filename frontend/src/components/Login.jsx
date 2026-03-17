import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, NavLink } from "react-router";
import { useAuth } from "../store/useAuth";
import { toast } from "react-hot-toast";

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const login = useAuth((state) => state.login);
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const currentUser = useAuth((state) => state.currentUser);
  const loading = useAuth((state) => state.loading);
  const error = useAuth((state) => state.error);

  const onLogin = async (userCred) => {
    await login(userCred);
  };

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      toast.success("Login successful!");
      if (currentUser.role === "ADMIN") {
        navigate("/admin-dashboard");
      } else if (currentUser.role === "INSTRUCTOR") {
        navigate("/instructor-dashboard");
      } else {
        navigate("/user-dashboard");
      }
    }
  }, [isAuthenticated, currentUser, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-blue-50 border border-gray-100">
        <div>
          <h2 className="mt-6 text-center text-4xl font-black text-gray-900 tracking-tight">
            Welcome Back
          </h2>
          <p className="mt-2 text-center text-sm text-gray-500 font-medium">
            Don't have an account?{" "}
            <NavLink to="/register" className="font-bold text-blue-600 hover:text-blue-500 transition-colors">
              Create one for free
            </NavLink>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onLogin)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">Email Address</label>
              <input
                {...register("email", { required: "Email is required" })}
                type="email"
                className="appearance-none relative block w-full px-4 py-4 border border-gray-200 placeholder-gray-400 text-gray-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all sm:text-sm font-medium bg-gray-50/50"
                placeholder="name@example.com"
              />
              {errors.email && <p className="mt-1 text-xs text-red-500 font-bold ml-1">{errors.email.message}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">Password</label>
              <input
                {...register("password", { required: "Password is required" })}
                type="password"
                className="appearance-none relative block w-full px-4 py-4 border border-gray-200 placeholder-gray-400 text-gray-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all sm:text-sm font-medium bg-gray-50/50"
                placeholder="••••••••"
              />
              {errors.password && <p className="mt-1 text-xs text-red-500 font-bold ml-1">{errors.password.message}</p>}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded-lg cursor-pointer"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-500 font-medium cursor-pointer">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <NavLink to="/register" className="font-bold text-blue-600 hover:text-blue-500 transition-colors">
                Forgot password?
              </NavLink>
            </div>
          </div>

          <div>
            <button
              disabled={loading}
              type="submit"
              className={`group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-black rounded-2xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all active:scale-95 shadow-lg shadow-blue-100 ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : "Sign In"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
