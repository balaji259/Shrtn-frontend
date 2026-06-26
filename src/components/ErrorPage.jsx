import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AlertTriangle, Home } from 'lucide-react';

const ErrorPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const message = searchParams.get("message") || "An unexpected error occurred. The link might be invalid or deleted.";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl text-center">
        {/* Warning Icon with pulse */}
        <div className="w-20 h-20 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-red-500/20">
          <AlertTriangle className="w-10 h-10 text-red-500 animate-bounce" />
        </div>

        <h1 className="text-3xl font-bold bg-gradient-to-r from-red-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4 font-montserrat">
          Oops! Link Error
        </h1>

        <p className="text-slate-300 text-md leading-relaxed mb-8 px-2 font-montserrat">
          {message}
        </p>

        {/* Back buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 transform hover:scale-102 flex items-center justify-center gap-2 cursor-pointer font-montserrat"
          >
            <Home className="w-5 h-5" />
            <span>Go to Dashboard</span>
          </button>
          <button
            onClick={() => navigate("/")}
            className="w-full bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 hover:text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 cursor-pointer font-montserrat"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
