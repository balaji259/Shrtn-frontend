import React, { useState, useContext, useEffect } from 'react'
import Graph from './Graph'
// import { dummyData } from '../../dummyData/data'
// import { useStoreContext } from '../../context/ContextApi'
import { ContextApi, ContextProvider } from '../../context/ContextApi';
import { useFetchMyShortUrls, useFetchTotalClicks } from '../../hooks/useQuery'
import ShortenPopUp from './ShortenPopUp'
import { Plus } from 'lucide-react';
import { FaLink } from 'react-icons/fa'
import ShortenUrlList from './ShortenUrlList'
import { useNavigate } from 'react-router-dom'
// import Loader from '../Loader'

const DashboardLayout = () => {
    // const refetch = false;
    const { token } = useContext(ContextApi);
    const navigate = useNavigate();
    const [shortenPopUp, setShortenPopUp] = useState(false);

    // console.log(useFetchTotalClicks(token, onError));

    const {isLoading, data: myShortenUrls, refetch } = useFetchMyShortUrls(token, onError)
    
    const {isLoading: loader, data: totalClicks} = useFetchTotalClicks(token, onError)


    function onError() {
      navigate("/error");
    }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl" style={{animationDelay: '2s'}} />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-300/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}} />
        </div>

        <div className="relative lg:px-14 sm:px-8 px-4">
            {loader ? ( 
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-blue-400 rounded-full animate-spin" style={{animationDirection: 'reverse', animationDuration: '0.8s'}} />
                    </div>
                </div>
            ): ( 
            <div className="lg:w-[90%] w-full mx-auto py-16">
                {/* Enhanced Chart Container */}
                <div className="h-96 relative mb-8 bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-xl hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500">
                    {totalClicks.length === 0 && (
                         <div className="absolute flex flex-col justify-center sm:items-center items-end w-full left-0 top-0 bottom-0 right-0 m-auto">
                             <div className="text-center space-y-4">
                                 <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                     <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                     </svg>
                                 </div>
                                 <h1 className="text-slate-800 font-bold sm:text-3xl text-xl mb-3 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                   No Data For This Time Period
                                 </h1>
                                 <h3 className="sm:w-96 w-[90%] sm:ml-0 text-center sm:text-lg text-base text-slate-600 leading-relaxed">
                                   Share your short links to view where your engagements are coming from
                                 </h3>
                             </div>
                         </div>
                    )}
                    <Graph graphData={totalClicks} />
                </div>

                {/* Enhanced Create Button Section */}
                <div className='py-8 sm:text-end text-center'>
                    <button 
      onClick={() => setShortenPopUp(true)}
      className="relative overflow-hidden group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
    >
      {/* Left-to-right sliding overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"></div>
      
      {/* Button content */}
      <div className="relative z-10 flex items-center gap-3">
        {/* Plus icon with rotation animation */}
        <Plus className="w-5 h-5 transition-transform duration-300 group-hover:rotate-180" />
        <span>Create a New Short URL</span>
      </div>
      
      {/* Shimmer effect */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-out"></div>
    </button>
                </div>

                {/* Enhanced URLs Section */}
                <div className="mt-12">
                  {!isLoading && myShortenUrls.length === 0 ? (
                    <div className="flex justify-center pt-16">
                      <div className="group relative bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-lg hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-500 max-w-md">
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        <div className="relative text-center space-y-4">
                            {/* Icon container */}
                            <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <FaLink className="text-blue-500 text-2xl" />
                            </div>
                            
                            <h1 className="text-slate-800 font-bold sm:text-xl text-lg mb-3 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                              You haven't created any short link yet
                            </h1>
                            
                            <p className="text-slate-500 text-sm leading-relaxed">
                                Get started by creating your first shortened URL
                            </p>
                        </div>
                      </div>
                  </div>
                  ) : (
                      <div className="space-y-6">
                          {/* Section Header */}
                          <div className="text-center mb-8">
                              <h2 className="text-3xl font-bold text-slate-800 mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                  Your Shortened URLs
                              </h2>
                              <p className="text-slate-500">Manage and track your URL performance</p>
                          </div>
                          
                          {/* Enhanced URL List Container */}
                          <div className="bg-white/50 backdrop-blur-sm border border-white/30 rounded-3xl p-6 shadow-lg">
                              <ShortenUrlList data={myShortenUrls} />
                          </div>
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