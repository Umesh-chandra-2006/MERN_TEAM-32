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
    <div className="mx-auto grid min-h-[calc(100vh-9rem)] max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-16">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-950 p-8 text-white shadow-[0_32px_90px_-36px_rgba(15,23,42,0.75)] lg:p-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.22),transparent_34%),radial-gradient(circle_at_80%_20%,rgba(245,158,11,0.18),transparent_24%)]" />
        <div className="relative z-10 flex h-full flex-col justify-between gap-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-300">Welcome back</p>
            <h2 className="mt-4 max-w-md text-4xl font-black tracking-tight sm:text-5xl">Pick up where you left off.</h2>
            <p className="mt-5 max-w-md text-base leading-7 text-slate-300">
              Sign in to continue learning, review your progress, and jump back into your course dashboard.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ["Focused", "No clutter"],
              ["Fast", "One-click access"],
              ["Clear", "Role-based views"],
            ].map(([title, text]) => (
              <div key={title} className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <p className="text-sm font-semibold text-white">{title}</p>
                <p className="mt-1 text-sm text-slate-300">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-[2.5rem] border border-white/70 bg-white/85 p-8 shadow-[0_24px_80px_-44px_rgba(15,23,42,0.45)] backdrop-blur-xl lg:p-10">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-slate-950">Sign in</h2>
          <p className="mt-2 text-sm font-medium text-slate-500">
            Don&apos;t have an account?{" "}
            <NavLink to="/register" className="font-semibold text-blue-700 transition-colors hover:text-blue-600">
              Create one for free
            </NavLink>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onLogin)}>
          <div className="space-y-5">
            <div>
              <label className="mb-1 ml-1 block text-sm font-semibold text-slate-700">Email Address</label>
              <input
                {...register("email", { required: "Email is required" })}
                type="email"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-slate-900 shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                placeholder="name@example.com"
              />
              {errors.email && <p className="mt-1 text-xs font-semibold text-rose-500 ml-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="mb-1 ml-1 block text-sm font-semibold text-slate-700">Password</label>
              <input
                {...register("password", { required: "Password is required" })}
                type="password"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-slate-900 shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                placeholder="••••••••"
              />
              {errors.password && <p className="mt-1 text-xs font-semibold text-rose-500 ml-1">{errors.password.message}</p>}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-3 text-sm font-medium text-slate-500">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              Remember me
            </label>

            <div className="text-sm">
              <NavLink to="/forgot-password" className="font-semibold text-blue-700 transition-colors hover:text-blue-600">
                Forgot password?
              </NavLink>
            </div>
          </div>

          <button
            disabled={loading}
            type="submit"
            className={`flex w-full items-center justify-center rounded-2xl bg-slate-950 px-4 py-4 text-sm font-black text-white shadow-xl shadow-slate-950/15 transition-transform hover:-translate-y-0.5 active:scale-95 ${loading ? "cursor-not-allowed opacity-70" : ""}`}
          >
            {loading ? (
              <svg className="h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
