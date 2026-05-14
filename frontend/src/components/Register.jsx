import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router";
import { toast } from "react-hot-toast";
import { api } from "../store/useAuth";

function Register() {
  const getFriendlyErrorMessage = (error) => {
    const apiMessage = error.response?.data?.message || "";
    const apiDetails = error.response?.data?.details || [];

    if (apiMessage.toLowerCase().includes("duplicate") || apiDetails.some((detail) => String(detail).toLowerCase().includes("email"))) {
      return "An account with this email already exists. Please use a different email or sign in.";
    }

    return apiMessage || "Registration failed. Please try again.";
  };

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
      let response = await api.post(
        `/${apiPath}/users`,
        newUser
      );

      if (response.status === 201) {
        toast.success("Registration successful! Please login.");
        navigate("/login");
      }
    } catch (error) {
      const msg = getFriendlyErrorMessage(error);
      toast.error(msg);
      console.error("Error during registration: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto grid min-h-[calc(100vh-9rem)] max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-16">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-[linear-gradient(160deg,#0f172a,#111827_55%,#1d4ed8)] p-8 text-white shadow-[0_32px_90px_-36px_rgba(15,23,42,0.75)] lg:p-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_25%),radial-gradient(circle_at_bottom_left,rgba(245,158,11,0.18),transparent_24%)]" />
        <div className="relative z-10 flex h-full flex-col justify-between gap-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-300">Join SunStk</p>
            <h2 className="mt-4 max-w-md text-4xl font-black tracking-tight sm:text-5xl">Build, teach, and learn in one place.</h2>
            <p className="mt-5 max-w-md text-base leading-7 text-slate-300">
              Create your account and get a more focused learning experience with role-aware dashboards and video-based courses.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ["Students", "Track progress"],
              ["Instructors", "Publish courses"],
              ["Admins", "Manage access"],
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
          <h2 className="text-4xl font-black tracking-tight text-slate-950">Create account</h2>
          <p className="mt-2 text-sm font-medium text-slate-500">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-blue-700 transition-colors hover:text-blue-600">
              Sign in here
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit(onRegister)} className="mt-8 space-y-6">
          <div className="grid grid-cols-1 gap-3 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-1 sm:grid-cols-2">
            <label className={`flex cursor-pointer items-center justify-center rounded-[1.1rem] py-3 text-sm font-semibold transition-all ${selectedRole === "STUDENT" ? "bg-white text-slate-950 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}>
              <input type="radio" value="STUDENT" {...register("role")} className="hidden" />
              Student
            </label>
            <label className={`flex cursor-pointer items-center justify-center rounded-[1.1rem] py-3 text-sm font-semibold transition-all ${selectedRole === "INSTRUCTOR" ? "bg-white text-slate-950 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}>
              <input type="radio" value="INSTRUCTOR" {...register("role")} className="hidden" />
              Instructor
            </label>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="mb-1 ml-1 block text-sm font-semibold text-slate-700">First Name</label>
              <input
                type="text"
                {...register("firstName", { required: "Required", minLength: { value: 3, message: "Min 3 chars" } })}
                placeholder="John"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-slate-900 shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
              {errors.firstName && <p className="ml-1 text-[10px] font-bold text-rose-500">{errors.firstName.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="mb-1 ml-1 block text-sm font-semibold text-slate-700">Last Name</label>
              <input
                type="text"
                {...register("lastName", { required: "Required", minLength: { value: 3, message: "Min 3 chars" } })}
                placeholder="Doe"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-slate-900 shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
              {errors.lastName && <p className="ml-1 text-[10px] font-bold text-rose-500">{errors.lastName.message}</p>}
            </div>
          </div>

          <div className="space-y-1">
            <label className="mb-1 ml-1 block text-sm font-semibold text-slate-700">Email Address</label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              placeholder="john@example.com"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-slate-900 shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
            {errors.email && <p className="ml-1 text-[10px] font-bold text-rose-500">{errors.email.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="mb-1 ml-1 block text-sm font-semibold text-slate-700">Password</label>
            <input
              type="password"
              {...register("password", { required: "Required", minLength: { value: 6, message: "Min 6 chars" } })}
              placeholder="••••••••"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-slate-900 shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
            {errors.password && <p className="ml-1 text-[10px] font-bold text-rose-500">{errors.password.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="mb-1 ml-1 block text-sm font-semibold text-slate-700">Profile Image URL (Optional)</label>
            <input
              type="text"
              {...register("profileImageUrl")}
              placeholder="https://example.com/photo.jpg"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-slate-900 shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`flex w-full items-center justify-center rounded-2xl bg-slate-950 px-4 py-4 text-sm font-black text-white shadow-xl shadow-slate-950/15 transition-transform hover:-translate-y-0.5 active:scale-95 ${loading ? "cursor-not-allowed opacity-70" : ""}`}
          >
            {loading ? (
              <svg className="h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : "Create account"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
