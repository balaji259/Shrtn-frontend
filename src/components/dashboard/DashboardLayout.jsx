import React, { useState, useContext } from 'react'
import Graph from './Graph'
import { ContextApi } from '../../context/ContextApi';
import { useFetchMyShortUrls, useFetchTotalClicks } from '../../hooks/useQuery'
import ShortenPopUp from './ShortenPopUp'
import { Plus, BarChart3, Link as LinkIcon } from 'lucide-react';
import ShortenUrlList from './ShortenUrlList'
import { useNavigate } from 'react-router-dom'

const DashboardLayout = () => {
    const { token } = useContext(ContextApi);
    const navigate = useNavigate();
    const [shortenPopUp, setShortenPopUp] = useState(false);

    const { isLoading, data: myShortenUrls = [], refetch } = useFetchMyShortUrls(token, onError)
    const { isLoading: loader, data: totalClicks = [] } = useFetchTotalClicks(token, onError)

    function onError() {
      navigate("/error");
    }

    const totalClicksSum = myShortenUrls.reduce((sum, item) => sum + (item.clickCount || 0), 0);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 font-montserrat">
        <div className="max-w-7xl lg:w-[90%] w-full mx-auto px-4 sm:px-8 py-8 sm:py-10">
            {loader ? ( 
                <div className="flex items-center justify-center min-h-[50vh]">
                    <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin" />
                </div>
            ) : ( 
            <div className="flex flex-col gap-6">
                {/* Dashboard Header / Welcome */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-5">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
                        <p className="text-xs text-slate-500 mt-0.5">Overview of your shortened links and performance analytics</p>
                    </div>
                    <button 
                      onClick={() => setShortenPopUp(true)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4.5 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer self-start sm:self-auto"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Create New Link</span>
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-xs flex items-center gap-4">
                        <div className="w-10 h-10 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                            <LinkIcon className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Links</span>
                            <span className="text-xl font-bold text-slate-800">{myShortenUrls.length}</span>
                        </div>
                    </div>
                    <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-xs flex items-center gap-4">
                        <div className="w-10 h-10 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                            <BarChart3 className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Click Volume</span>
                            <span className="text-xl font-bold text-slate-800">{totalClicksSum}</span>
                        </div>
                    </div>
                </div>

                {/* Main Clicks Chart Container */}
                <div className="bg-white border border-slate-200/60 rounded-2xl p-5 sm:p-6 shadow-xs relative flex flex-col gap-4">
                    <div>
                        <h3 className="text-sm font-bold text-slate-800 font-montserrat">Click Activity</h3>
                        <p className="text-[11px] text-slate-400">Total analytics events recorded across all shortened URLs</p>
                    </div>

                    <div className="h-64 sm:h-[300px] w-full relative">
                        {totalClicks.length === 0 ? (
                             <div className="absolute inset-0 flex flex-col justify-center items-center bg-white/80 z-10 text-center p-4">
                                 <BarChart3 className="w-8 h-8 text-slate-300 mb-2" />
                                 <h4 className="text-slate-700 font-bold text-sm mb-0.5">No Activity Data</h4>
                                 <p className="text-slate-400 text-xs max-w-xs">Share your short links to begin collecting click events.</p>
                             </div>
                        ) : null}
                        <Graph graphData={totalClicks} />
                    </div>
                </div>

                {/* URLs Section */}
                <div className="mt-4">
                  {!isLoading && myShortenUrls.length === 0 ? (
                    <div className="flex justify-center py-10">
                      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xs text-center max-w-md w-full flex flex-col items-center gap-3">
                         <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 mb-1">
                             <LinkIcon className="w-6 h-6" />
                         </div>
                         <h3 className="text-slate-800 font-bold text-base font-montserrat">
                           No links created yet
                         </h3>
                         <p className="text-slate-500 text-xs max-w-xs leading-relaxed">
                           Shorten your first destination URL and track its performance in real-time.
                         </p>
                         <button 
                           onClick={() => setShortenPopUp(true)}
                           className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4.5 py-2 rounded-xl transition-all shadow-sm cursor-pointer mt-2"
                         >
                           Get Started
                         </button>
                      </div>
                    </div>
                  ) : (
                      <div className="flex flex-col gap-4">
                          <ShortenUrlList data={myShortenUrls} refetch={refetch} />
                      </div>
                  )}
                </div>
            </div>
            )}

            <ShortenPopUp
              refetch={refetch}
              open={shortenPopUp}
              setOpen={setShortenPopUp}
            />
        </div>
    </div>
  )
}

export default DashboardLayout