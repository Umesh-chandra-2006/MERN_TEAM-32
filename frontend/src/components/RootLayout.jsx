import { Outlet } from "react-router";
import Header from "./Header";
import Footer from "./Footer";

function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col text-slate-900">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.14),transparent_32%),radial-gradient(circle_at_85%_15%,rgba(245,158,11,0.12),transparent_24%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_52%,#f8fafc_100%)]" />
      <div className="pointer-events-none fixed inset-0 -z-10 opacity-50 bg-[linear-gradient(90deg,rgba(15,23,42,0.02)_1px,transparent_1px),linear-gradient(rgba(15,23,42,0.02)_1px,transparent_1px)] bg-[size:26px_26px] [mask-image:linear-gradient(180deg,rgba(0,0,0,0.8),transparent_92%)]" />
      <Header />
      <main className="relative flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default RootLayout;
