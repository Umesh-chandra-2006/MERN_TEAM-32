import React from "react";

function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200/80 bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-slate-400">SunStk Team</p>
            <p className="mt-3 text-lg font-semibold text-slate-100">
              A sharper learning experience for students, instructors, and admins.
            </p>
          </div>
          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} SunStk Team. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
