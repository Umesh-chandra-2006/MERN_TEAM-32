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
} from "../styles/common";
import { useAuth } from "../store/useAuth";
import { toast } from "react-hot-toast";


function Login() {
  const {
    register,
    handleSubmit,
    //setError,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const login = useAuth((state) => state.login);
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const currentUser = useAuth((state) => state.currentUser);
  console.log("Current user after login: ", currentUser);
  console.log("Is authenticated: ", isAuthenticated);

  const onLogin = async (newUser) => {
    await login(newUser);
  };

  useEffect(() => {
    if (isAuthenticated) {
      toast.success("Login successful!");
      if (currentUser.role === "ADMIN") {
        navigate("/admin-dashboard");
      } else if (currentUser.role === "AUTHOR") {
        navigate("/author-dashboard");
      } else {
        navigate("/user-dashboard");
      }
    }
  }, [isAuthenticated, navigate]);

  if (loading) {
    return <div className="text-center p-4">Adding user...</div>;
  }
  if (error !== null) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="mt-15 p-4  w-96 mx-auto text-center">
      <h1 className="text-2xl mb-2">User Login Form </h1>
      
      <div className=" p-4">
        <form className={formCard} onSubmit={handleSubmit(onLogin)}>
          <div className={formGroup}>
            <label className={labelClass}>Email</label>
            <input
              type="email"
              className={inputClass}
              placeholder="Enter your email"
              {...register("email", { required: "Email is required" })}
            />
          </div>
          <div className={formGroup}>
            <label className={labelClass}>Password</label>
            <input
              type="password"
              className={inputClass}
              placeholder="Enter your password"
              {...register("password", { required: "Password is required" })}
            />
          </div>

          <div className="text-right  mb-4">
            <NavLink
              to="/register"
              className="text-blue-500 hover:underline text-sm"
            >
              Forgot Password?
            </NavLink>
          </div>

          <button type="submit" className={submitBtn}>
            Login
          </button>
          <div className="text-left mt-4">
            <NavLink
              to="/register"
              className="text-blue-500 hover:underline text-sm"
            >
              Don't have an account? Register here.
            </NavLink>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;