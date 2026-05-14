import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useSearchParams, useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import { api } from "../store/useAuth";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const [loading, setLoading] = useState(false);
  const newPassword = watch("newPassword");

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await api.post("/common-api/reset-password", {
        token,
        newPassword: data.newPassword,
      });
      toast.success("Password updated successfully");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto grid min-h-[calc(100vh-9rem)] max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-16">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-950 p-8 text-white shadow-[0_32px_90px_-36px_rgba(15,23,42,0.75)] lg:p-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.22),transparent_34%),radial-gradient(circle_at_80%_20%,rgba(245,158,11,0.18),transparent_24%)]" />
        <div className="relative z-10 flex h-full flex-col justify-between gap-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-300">Reset password</p>
            <h2 className="mt-4 max-w-md text-4xl font-black tracking-tight sm:text-5xl">Choose a new password.</h2>
            <p className="mt-5 max-w-md text-base leading-7 text-slate-300">
              Use the token from your reset link to safely update your password.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[["Secure", "Token-based"], ["Fast", "One form"], ["Simple", "Back to login"]].map(([title, text]) => (
              <div key={title} className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <p className="text-sm font-semibold text-white">{title}</p>
                <p className="mt-1 text-sm text-slate-300">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-[2.5rem] border border-white/70 bg-white/85 p-8 shadow-[0_24px_80px_-44px_rgba(15,23,42,0.45)] backdrop-blur-xl lg:p-10">
        <h2 className="text-4xl font-black tracking-tight text-slate-950">Reset password</h2>
        <p className="mt-2 text-sm font-medium text-slate-500">
          Remembered it already? <Link to="/login" className="font-semibold text-blue-700 transition-colors hover:text-blue-600">Sign in</Link>
        </p>

        {!token ? (
          <div className="mt-8 rounded-3xl border border-amber-100 bg-amber-50 p-5 text-amber-900">
            Reset token is missing. Open the full reset link from the forgot-password page.
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="mb-1 ml-1 block text-sm font-semibold text-slate-700">New Password</label>
              <input
                {...register("newPassword", {
                  required: "New password is required",
                  minLength: { value: 6, message: "Min 6 characters" },
                })}
                type="password"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-slate-900 shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                placeholder="••••••••"
              />
              {errors.newPassword && <p className="mt-1 text-xs font-semibold text-rose-500 ml-1">{errors.newPassword.message}</p>}
            </div>

            <div>
              <label className="mb-1 ml-1 block text-sm font-semibold text-slate-700">Confirm New Password</label>
              <input
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) => value === newPassword || "Passwords do not match",
                })}
                type="password"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-slate-900 shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                placeholder="••••••••"
              />
              {errors.confirmPassword && <p className="mt-1 text-xs font-semibold text-rose-500 ml-1">{errors.confirmPassword.message}</p>}
            </div>

            <button
              disabled={loading}
              type="submit"
              className={`flex w-full items-center justify-center rounded-2xl bg-slate-950 px-4 py-4 text-sm font-black text-white shadow-xl shadow-slate-950/15 transition-transform hover:-translate-y-0.5 active:scale-95 ${loading ? "cursor-not-allowed opacity-70" : ""}`}
            >
              {loading ? "Saving..." : "Reset password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;