import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api/api';
import toast from 'react-hot-toast';
import { Lock, ArrowRight, Home } from 'lucide-react';

const ShortenUrlPage = () => {
    const { url } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const isPasswordRequired = searchParams.get("passwordRequired") === "true";
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (url && !isPasswordRequired) {
            window.location.href = import.meta.env.VITE_BACKEND_URL + `/${url}`;
        }
    }, [url, isPasswordRequired]);

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (!password.trim()) {
            toast.error("Password cannot be empty");
            return;
        }
        setLoading(true);
        try {
            const { data } = await api.post(`/api/urls/verify-password/${url}`, { password: password.trim() });
            window.location.href = data.originalUrl;
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Incorrect password";
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    if (isPasswordRequired) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-950 flex items-center justify-center p-4 relative overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
                </div>

                <div className="relative z-10 w-full max-w-md bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl text-center">
                    {/* Lock Icon */}
                    <div className="w-20 h-20 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-blue-500/20">
                        <Lock className="w-10 h-10 text-blue-500 animate-pulse" />
                    </div>

                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-3 font-montserrat">
                        Password Required
                    </h1>

                    <p className="text-slate-300 text-sm leading-relaxed mb-6 font-montserrat px-2">
                        This link is password protected. Enter the password to unlock and redirect.
                    </p>

                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                        <div className="relative">
                            <input
                                type="password"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-montserrat"
                                required
                                disabled={loading}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 transform hover:scale-102 flex items-center justify-center gap-2 cursor-pointer font-montserrat"
                        >
                            <span>{loading ? "Unlocking..." : "Unlock & Proceed"}</span>
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </form>

                    <button
                        onClick={() => navigate("/")}
                        className="w-full mt-4 bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 hover:text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 font-montserrat text-sm"
                    >
                        <Home className="w-4 h-4" />
                        <span>Go Home</span>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center font-montserrat text-white gap-3">
            <div className="w-12 h-12 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin" />
            <p className="text-slate-400 text-sm tracking-wide">Redirecting you to your destination...</p>
        </div>
    );
};

export default ShortenUrlPage;