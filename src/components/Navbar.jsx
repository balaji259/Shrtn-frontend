import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from "react";
import { ContextApi } from '../context/ContextApi';
import { Link2 } from 'lucide-react';

const Navbar = () => {
  const { setToken } = useContext(ContextApi);
  const navigate = useNavigate();

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40 w-full font-montserrat">
      <div className="max-w-7xl lg:w-[90%] w-full mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 select-none">
          <div className="w-8 h-8 bg-indigo-50 border border-indigo-100 rounded-lg flex items-center justify-center">
            <Link2 className="w-4 h-4 text-indigo-600" />
          </div>
          <span className="text-lg font-bold text-slate-900 tracking-tight">
            Shrtn<span className="text-indigo-600">.</span>
          </span>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-950 font-semibold px-4 py-1.5 rounded-xl transition-all cursor-pointer text-xs"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

