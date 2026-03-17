import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router";
import {
  formCard,
  formGroup,
  labelClass,
  inputClass,
  submitBtn,
  formTitle,
  errorClass,
  divider
} from "../styles/common";
import { useAuth } from "../store/useAuth";
import { toast } from "react-hot-toast";

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const login = useAuth((state) => state.login);
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const currentUser = useAuth((state) => state.currentUser);

  const onLogin = async (data) => {
    setLoading(true);
    setError(null);

    try {
      await login(data);

      if (!useAuth.getState().isAuthenticated) {
        setError("Invalid email or password");
      }
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      toast.success("Login successful!");

      if (currentUser.role === "ADMIN") {
        navigate("/admin-dashboard");
      } else if (currentUser.role === "INSTRUCTOR") {
        navigate("/instructor-dashboard");
      } else {
        navigate("/student-dashboard");
      }
    }
  }, [isAuthenticated, currentUser, navigate]);

  return (
    <div className="mt-20 px-4">

      <form className={formCard} onSubmit={handleSubmit(onLogin)}>

        {/* Title */}
        <h1 className={formTitle}>Welcome Back</h1>
        <div className={divider}></div>

        {/* ✅ Error Box (clean, using your class only) */}
        {error && (
          <div className={`${errorClass} mb-4`}>
            {error}
          </div>
        )}

        {/* Email */}
        <div className={formGroup}>
          <label className={labelClass}>Email</label>
          <input
            type="email"
            className={inputClass}
            placeholder="Enter your email"
            {...register("email", { required: true })}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">Email is required</p>
          )}
        </div>

        {/* Password */}
        <div className={formGroup}>
          <label className={labelClass}>Password</label>
          <input
            type="password"
            className={inputClass}
            placeholder="Enter your password"
            {...register("password", { required: true })}
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">Password is required</p>
          )}
        </div>

        {/* Forgot Password */}
        <div className="text-right mb-4">
          <NavLink
            to="/register"
            className="text-[#0066cc] hover:text-[#004499] text-sm"
          >
            Forgot Password?
          </NavLink>
        </div>

        {/* Submit */}
        <button type="submit" className={submitBtn} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Register */}
        <div className="text-center mt-5 text-sm text-gray-600">
          Don't have an account?{" "}
          <NavLink
            to="/register"
            className="text-[#0066cc] hover:text-[#004499]"
          >
            Register
          </NavLink>
        </div>

      </form>
    </div>
  );
}

export default Login;