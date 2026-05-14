import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { toast } from "react-hot-toast";
import { api } from "../store/useAuth";

function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [resetLinkSent, setResetLinkSent] = useState(false);

  const onSubmit = async ({ email }) => {
    setLoading(true);
    try {
      const response = await api.post("/common-api/forgot-password", { email });
      setResetLinkSent(Boolean(response.data.payload?.resetLinkSent));
      toast.success("If the account exists, a reset link has been prepared.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to generate reset link");
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
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-300">Password help</p>
            <h2 className="mt-4 max-w-md text-4xl font-black tracking-tight sm:text-5xl">Get back into your account.</h2>
            <p className="mt-5 max-w-md text-base leading-7 text-slate-300">
              Enter your email and we’ll generate a reset link you can use to set a new password.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[["Step 1", "Request link"], ["Step 2", "Open reset page"], ["Step 3", "Set new password"]].map(([title, text]) => (
              <div key={title} className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <p className="text-sm font-semibold text-white">{title}</p>
                <p className="mt-1 text-sm text-slate-300">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-[2.5rem] border border-white/70 bg-white/85 p-8 shadow-[0_24px_80px_-44px_rgba(15,23,42,0.45)] backdrop-blur-xl lg:p-10">
        <h2 className="text-4xl font-black tracking-tight text-slate-950">Forgot password</h2>
        <p className="mt-2 text-sm font-medium text-slate-500">
          Go back to <Link to="/login" className="font-semibold text-blue-700 transition-colors hover:text-blue-600">sign in</Link>
        </p>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
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

          <button
            disabled={loading}
            type="submit"
            className={`flex w-full items-center justify-center rounded-2xl bg-slate-950 px-4 py-4 text-sm font-black text-white shadow-xl shadow-slate-950/15 transition-transform hover:-translate-y-0.5 active:scale-95 ${loading ? "cursor-not-allowed opacity-70" : ""}`}
          >
            {loading ? "Generating link..." : "Generate reset link"}
          </button>
        </form>

        {resetLinkSent && (
          <div className="mt-8 rounded-3xl border border-emerald-100 bg-emerald-50 p-5">
            <p className="text-sm font-bold text-emerald-800">Reset request prepared</p>
            <p className="mt-2 text-sm text-emerald-700">
              In production, this should be delivered by email. For local development, check the server console for the generated link.
            </p>
            <Link
              to="/login"
              className="mt-4 inline-flex rounded-full bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-emerald-700"
            >
              Back to sign in
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;