import React from "react";

function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 px-10 py-6">
      
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">

        {/* Left Section */}
        <div className="flex items-center gap-3">
          <span className="text-gray-700 font-semibold text-lg">
            Udemy
          </span>

          <img
            src="https://png.pngtree.com/png-clipart/20220509/original/pngtree-brain-logo-design-for-educational-png-image_7667200.png"
            alt="logo"
            className="w-10"
          />
        </div>

        {/* Center Section */}
        <div className="text-gray-600 text-sm text-center">
          © 2026 Learning App. All rights reserved.
        </div>

        {/* Right Section */}
        <div className="text-gray-600 text-sm text-right leading-6">
          <p className="font-semibold text-gray-800">Contact Us</p>
          <p>📞 939858953</p>
          <p>✉️ 23eg105b08@anurag.edu.in</p>
          <p>
            📍 Room No: 206, Anurag University <br />
            Medchal, Telangana
          </p>
        </div>

      </div>

    </footer>
  );
}

export default Footer;