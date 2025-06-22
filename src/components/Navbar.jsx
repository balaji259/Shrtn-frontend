import React from 'react';

const Navbar = () => {
  const handleLogout = () => {
    console.log("User logged out");
  };

  return (
    <nav className="bg-[#2A6DF5] px-8 py-4 flex items-center justify-between shadow-lg animate-[fadeIn_0.5s_ease-in-out] relative z-10">
      
      {/* Project Name: subtle silver-white gradient */}
      <div className="text-2xl font-extrabold bg-gradient-to-r from-white via-gray-200 to-white text-transparent bg-clip-text tracking-wide drop-shadow hover:scale-105 transition-transform duration-300">
        Shrtn
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="bg-white text-[#2A6DF5] font-semibold px-5 py-2 rounded-full shadow-md hover:text-red-500 hover:ring-2 ring-red-100 transition-all duration-300"
      >
        Logout
      </button>

      {/* Inline fade-in animation */}
      <style>{`
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(-8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
