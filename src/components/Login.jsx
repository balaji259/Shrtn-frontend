import React, { useState, useEffect, useContext } from 'react';
import { Mail, Lock, Link as LinkIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import toast from 'react-hot-toast';
import { ContextApi } from '../context/ContextApi';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();
  const { token, setToken } = useContext(ContextApi);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) navigate("/dashboard");
  }, [token, navigate]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleGoogleLoginSuccess = async (response) => {
    setLoading(true);
    try {
      const idToken = response.credential;
      const res = await api.post(`/api/auth/google`, { idToken });
      setToken(res.data.name);
      localStorage.setItem("token", res.data.name);
      toast.success("Google Login Successful!");
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data || "Google Sign-in failed!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializeGoogle = () => {
      if (window.google) {
        const btn = document.getElementById("google-signin-button");
        if (btn) {
          window.google.accounts.id.initialize({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            callback: handleGoogleLoginSuccess
          });

          let containerWidth = btn.parentElement ? btn.parentElement.clientWidth : 300;
          if (containerWidth === 0) {
            containerWidth = Math.min(350, window.innerWidth - 64);
          }
          const buttonWidth = Math.min(400, Math.max(200, containerWidth));

          window.google.accounts.id.renderButton(
            btn,
            { theme: "outline", size: "large", width: buttonWidth, shape: "rectangular", logo_alignment: "left" }
          );
        } else {
          setTimeout(initializeGoogle, 100);
        }
      } else {
        setTimeout(initializeGoogle, 100);
      }
    };
    initializeGoogle();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post(`/api/auth/login`, formData);
      setToken(response.data.name);
      localStorage.setItem("token", response.data.name);
      toast.success("Login Successful!");
      setFormData({ email: '', password: '' });
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error("Login failed! Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden font-montserrat">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin" />
          <p className="text-slate-600 text-sm font-semibold">Verifying account...</p>
        </div>
      )}

      {/* Main Login Card */}
      <div className="relative z-10 w-full max-w-[400px]">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col gap-6">
          {/* Header */}
          <div className="text-center flex flex-col items-center gap-2">
            <div className="w-10 h-10 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center mb-1">
              <LinkIcon className="w-5 h-5 text-indigo-600 animate-pulse" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Sign in to Shrtn
            </h1>
            <p className="text-slate-500 text-xs">
              Simplify, track, and manage your shortened URLs
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl pl-11 pr-4 py-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm transition-all"
                required
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl pl-11 pr-4 py-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm transition-all"
                required
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-4 rounded-xl shadow-sm hover:shadow transition-all duration-150 cursor-pointer text-sm"
            >
              Sign In
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center">
            <div className="flex-grow border-t border-slate-100"></div>
            <span className="mx-3 text-slate-400 text-[10px] uppercase font-bold tracking-wider">or</span>
            <div className="flex-grow border-t border-slate-100"></div>
          </div>

          {/* Google Sign-in */}
          <div className="w-full flex justify-center min-h-[40px]">
            <div id="google-signin-button"></div>
          </div>

          {/* Register Link */}
          <p className="text-center text-slate-500 text-xs mt-2">
            New to Shrtn?{' '}
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="text-indigo-600 hover:text-indigo-800 font-semibold hover:underline cursor-pointer"
            >
              Create an account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;