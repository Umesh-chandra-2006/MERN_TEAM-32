import React from "react";

function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-gray-400 text-sm font-medium tracking-wide">
          © {new Date().getFullYear()} <span className="text-gray-900 font-bold tracking-tight">SunStk Team</span>. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
