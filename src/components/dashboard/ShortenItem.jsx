import dayjs from 'dayjs';
import React, { useEffect, useState, useContext, useCallback } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { FaExternalLinkAlt, FaRegCalendarAlt, FaQrcode, FaWhatsapp, FaLock, FaTrash } from 'react-icons/fa';
import { IoCopy } from 'react-icons/io5';
import { LiaCheckSolid } from 'react-icons/lia';
import { MdAnalytics, MdOutlineAdsClick } from 'react-icons/md';
import api from '../../api/api';
import { Link } from 'react-router-dom';
import { ContextApi } from '../../context/ContextApi';
import { Hourglass } from 'react-loader-spinner';
import Graph from './Graph';
import toast from 'react-hot-toast';

const ShortenItem = ({ originalUrl, shortUrl, clickCount, createdDate, oneTime, isPasswordProtected, expirationDate, id, refetch }) => {
    const { token } = useContext(ContextApi);
    const [isCopied, setIsCopied] = useState(false);
    const [analyticToggle, setAnalyticToggle] = useState(false);
    const [loader, setLoader] = useState(false);
    const [selectedUrl, setSelectedUrl] = useState("");
    const [analyticsData, setAnalyticsData] = useState([]);
    const [qrVisible, setQrVisible] = useState(false);
    const [referrerData, setReferrerData] = useState({});
    const [browserData, setBrowserData] = useState({});
    const [osData, setOsData] = useState({});
    const [deviceData, setDeviceData] = useState({});

    const subDomain = import.meta.env.VITE_REACT_FRONT_END_URL.replace(
      /^https?:\/\//,
      ""
    );

    const analyticsHandler = (shortUrl) => {
        if (!analyticToggle) {
            setSelectedUrl(shortUrl);
        }
        setAnalyticToggle(!analyticToggle);
    }

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this short URL? All associated click events will also be permanently deleted.")) {
            try {
                await api.delete(`/api/urls/${id}`, {
                    headers: {
                        Authorization: "Bearer " + token,
                    },
                });
                toast.success("Short URL deleted successfully!");
                if (refetch) {
                    refetch();
                }
            } catch (error) {
                console.error(error);
                toast.error(error.response?.data?.message || "Failed to delete Short URL");
            }
        }
    };

    const fetchMyShortUrl = useCallback(async () => {
        setLoader(true);
        try {
             const endDate = new Date().toISOString().split('T')[0] + "T23:59:59";
             const startDateObj = new Date();
             startDateObj.setFullYear(startDateObj.getFullYear() - 1);
             const startDate = startDateObj.toISOString().split('T')[0] + "T00:00:00";

             const { data } = await api.get(`/api/urls/analytics/${selectedUrl}?startDate=${startDate}&endDate=${endDate}`, {
                        headers: {
                          "Content-Type": "application/json",
                          Accept: "application/json",
                          Authorization: "Bearer " + token,
                        },
                      });
            setAnalyticsData(data.clickEvents || []);
            setReferrerData(data.referrer || {});
            setBrowserData(data.browser || {});
            setOsData(data.os || {});
            setDeviceData(data.device || {});
            setSelectedUrl("");
            console.log(data);
            
        } catch (error) {
            toast.error("Failed to fetch analytics");
            console.log(error);
        } finally {
            setLoader(false);
        }
    }, [selectedUrl, token]);

    useEffect(() => {
        if (selectedUrl) {
            fetchMyShortUrl();
        }
    }, [selectedUrl, fetchMyShortUrl]);

    const renderBreakdownCard = (title, data) => {
      const sortedEntries = Object.entries(data || {}).sort((a, b) => b[1] - a[1]);
      const totalVal = sortedEntries.reduce((sum, [, val]) => sum + val, 0);

      return (
        <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-4 flex-1 min-w-[200px] shadow-sm">
          <h4 className="text-slate-500 font-bold text-[10px] mb-3 font-montserrat uppercase tracking-wider border-b border-slate-200/60 pb-1.5">{title}</h4>
          {sortedEntries.length === 0 ? (
            <p className="text-slate-400 text-xs italic">No data available</p>
          ) : (
            <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
              {sortedEntries.map(([key, value]) => {
                const pct = totalVal > 0 ? (value / totalVal) * 100 : 0;
                return (
                  <div key={key} className="text-xs font-montserrat">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-slate-600 font-semibold truncate max-w-[120px]" title={key}>{key}</span>
                      <span className="text-slate-700 font-bold">{value} <span className="text-slate-400 font-normal">({pct.toFixed(0)}%)</span></span>
                    </div>
                    <div className="w-full bg-slate-200/60 rounded-full h-1.5">
                      <div 
                        className="bg-indigo-600 h-1.5 rounded-full transition-all duration-500" 
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      );
    };

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left Side: URL Info and Metadata */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <Link
              target="_blank"
              className="text-base font-bold text-indigo-600 hover:text-indigo-800 break-all transition-colors font-montserrat"
              to={import.meta.env.VITE_REACT_FRONT_END_URL + "/s/" + `${shortUrl}`}
            >
              {subDomain + "/s/" + `${shortUrl}`}
            </Link>
            <FaExternalLinkAlt className="text-indigo-400 shrink-0 text-xs cursor-pointer hover:text-indigo-600 transition-colors" />
            
            {isPasswordProtected && (
              <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-md border border-amber-100 font-montserrat">
                <FaLock className="text-[9px]" />
                Password
              </span>
            )}
 
            {oneTime && (
              <span className="inline-flex items-center bg-rose-50 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded-md border border-rose-100 font-montserrat">
                One-time
              </span>
            )}

            {expirationDate && (
              <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md border font-montserrat ${
                new Date(expirationDate) < new Date()
                  ? "bg-red-50 text-red-700 border-red-100"
                  : "bg-blue-50 text-blue-700 border-blue-100"
              }`}>
                {new Date(expirationDate) < new Date()
                  ? "Expired"
                  : `Expires: ${dayjs(expirationDate).format("MMM DD, YYYY hh:mm A")}`}
              </span>
            )}
          </div>

          <div className="mb-3">
            <span className="text-slate-400 text-sm break-all font-montserrat block truncate max-w-xl" title={originalUrl}>
              {originalUrl}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
            <div className="flex items-center gap-1 text-slate-500 text-xs font-semibold">
              <MdOutlineAdsClick className="text-sm text-slate-400" />
              <span>{clickCount} {clickCount === 1 ? "click" : "clicks"}</span>
            </div>

            <div className="flex items-center gap-1 text-slate-500 text-xs font-semibold">
              <FaRegCalendarAlt className="text-xs text-slate-400" />
              <span>{dayjs(createdDate).format("MMM DD, YYYY")}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Compact Icon Actions */}
        <div className="flex items-center gap-2 flex-wrap md:self-center">
          {/* Copy Button */}
          <CopyToClipboard
            onCopy={() => {
              setIsCopied(true);
              toast.success("Short URL Copied!", { id: "copy-toast" });
              setTimeout(() => setIsCopied(false), 2000);
            }}
            text={`${import.meta.env.VITE_REACT_FRONT_END_URL + "/s/" + `${shortUrl}`}`}
          >
            <button
              title="Copy Link"
              className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
                isCopied
                  ? "bg-indigo-50 border-indigo-200 text-indigo-600"
                  : "bg-slate-50 hover:bg-indigo-50 border-slate-100 hover:border-indigo-100 text-slate-500 hover:text-indigo-600"
              }`}
            >
              {isCopied ? <LiaCheckSolid className="text-base" /> : <IoCopy className="text-base" />}
            </button>
          </CopyToClipboard>

          {/* QR Code Button */}
          <button
            onClick={() => setQrVisible(true)}
            title="QR Code"
            className="p-2.5 rounded-xl border bg-slate-50 hover:bg-emerald-50 border-slate-100 hover:border-emerald-100 text-slate-500 hover:text-emerald-600 transition-all cursor-pointer flex items-center justify-center"
          >
            <FaQrcode className="text-base" />
          </button>

          {/* WhatsApp Button */}
          <button
            onClick={() => {
              const shareUrl = import.meta.env.VITE_REACT_FRONT_END_URL + "/s/" + shortUrl;
              const text = `Check out this shortened URL: ${shareUrl}`;
              window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
            }}
            title="Share via WhatsApp"
            className="p-2.5 rounded-xl border bg-slate-50 hover:bg-green-50 border-slate-100 hover:border-green-100 text-slate-500 hover:text-green-600 transition-all cursor-pointer flex items-center justify-center"
          >
            <FaWhatsapp className="text-base" />
          </button>

          {/* Analytics Button */}
          <button
            onClick={() => analyticsHandler(shortUrl)}
            title="Analytics"
            className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
              analyticToggle
                ? "bg-blue-50 border-blue-200 text-blue-600"
                : "bg-slate-50 hover:bg-blue-50 border-slate-100 hover:border-blue-100 text-slate-500 hover:text-blue-600"
            }`}
          >
            <MdAnalytics className="text-base" />
          </button>

          {/* Delete Button */}
          <button
            onClick={handleDelete}
            title="Delete Short URL"
            className="p-2.5 rounded-xl border bg-slate-50 hover:bg-rose-50 border-slate-100 hover:border-rose-100 text-slate-500 hover:text-rose-600 transition-all cursor-pointer flex items-center justify-center"
          >
            <FaTrash className="text-base" />
          </button>
        </div>
      </div>

      {/* Expandable Analytics Section */}
      {analyticToggle && (
        <div className="mt-5 pt-5 border-t border-slate-100">
          {loader ? (
            <div className="py-12 flex justify-center items-center w-full">
              <div className="flex flex-col items-center gap-2">
                <Hourglass
                  visible={true}
                  height="40"
                  width="40"
                  ariaLabel="hourglass-loading"
                  colors={['#4f46e5', '#818cf8']}
                />
                <p className="text-xs text-slate-400 font-medium">Fetching details...</p>
              </div>
            </div>
          ) : (
            <>
              {analyticsData.length === 0 ? (
                <div className="text-center py-8">
                  <h4 className="text-slate-700 font-bold text-sm mb-1 font-montserrat">
                    No Analytics Data Yet
                  </h4>
                  <p className="text-slate-400 text-xs max-w-xs mx-auto">
                    Share your short link to gather referrer, device, and location analytics.
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="h-64 relative w-full border border-slate-100 rounded-xl p-3 bg-slate-50/20">
                    <Graph graphData={analyticsData} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                    {renderBreakdownCard("Devices", deviceData)}
                    {renderBreakdownCard("Browsers", browserData)}
                    {renderBreakdownCard("Platforms (OS)", osData)}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* QR Code Modal Overlay */}
      {qrVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-xs w-full mx-4 shadow-xl border border-slate-100 flex flex-col items-center">
            <h3 className="text-slate-800 font-bold text-base mb-4 text-center font-montserrat">QR Code</h3>
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(import.meta.env.VITE_REACT_FRONT_END_URL + "/s/" + shortUrl)}`}
              alt="QR Code"
              className="w-44 h-44 border border-slate-100 rounded-xl p-3 bg-slate-50 mb-5"
            />
            <div className="flex gap-3 w-full">
              <button
                onClick={async () => {
                  try {
                    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(import.meta.env.VITE_REACT_FRONT_END_URL + "/s/" + shortUrl)}`;
                    const response = await fetch(qrUrl);
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `shrtn-${shortUrl}-qr.png`;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    window.URL.revokeObjectURL(url);
                    toast.success("QR Code Downloaded!");
                  } catch (error) {
                    console.error(error);
                    toast.error("Download failed");
                  }
                }}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-3 rounded-lg text-center cursor-pointer transition-colors font-montserrat text-xs"
              >
                Download
              </button>
              <button
                onClick={() => setQrVisible(false)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 px-3 rounded-lg text-center cursor-pointer transition-colors font-montserrat text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShortenItem;