import dayjs from 'dayjs';
import React, { useEffect, useState, useContext, useCallback } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard';
import { FaExternalLinkAlt, FaRegCalendarAlt, FaQrcode } from 'react-icons/fa';
import { IoCopy } from 'react-icons/io5';
import { LiaCheckSolid } from 'react-icons/lia';
import { MdAnalytics, MdOutlineAdsClick } from 'react-icons/md';
import api from '../../api/api';
import { Link } from 'react-router-dom';
// import { useStoreContext } from '../../context/ContextApi';
import { ContextApi } from '../../context/ContextApi';
import { Hourglass } from 'react-loader-spinner';
import Graph from './Graph';
import toast from 'react-hot-toast';

const ShortenItem = ({ originalUrl, shortUrl, clickCount, createdDate }) => {
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

    // const subDomain = import.meta.env.VITE_REACT_SUBDOMAIN.replace(
    //     /^https?:\/\//,
    //     ""
    //   );

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
      return (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex-1 min-w-[200px] shadow-sm">
          <h4 className="text-slate-700 font-bold text-xs mb-3 font-montserrat uppercase tracking-wider border-b border-slate-200 pb-1">{title}</h4>
          {sortedEntries.length === 0 ? (
            <p className="text-slate-400 text-xs font-montserrat italic">No data</p>
          ) : (
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {sortedEntries.map(([key, value]) => (
                <div key={key} className="flex justify-between items-center text-xs font-montserrat">
                  <span className="text-slate-600 font-medium truncate max-w-[120px]">{key}</span>
                  <span className="bg-slate-200 text-slate-800 px-2 py-0.5 rounded-full font-bold">{value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    };

  return (
    <div className={`bg-slate-100 shadow-lg border border-dotted border-slate-500 px-4 sm:px-6 sm:py-1 py-3 rounded-md transition-all duration-100`}>
      <div className={`flex sm:flex-row flex-col sm:justify-between w-full sm:gap-0 gap-5 py-5`}>
        <div className="flex-1 sm:space-y-1 max-w-full overflow-hidden">
          <div className="text-slate-900 pb-1 sm:pb-0 flex items-center gap-2 flex-wrap">
            <Link
              target="_blank"
              className="text-[15px] sm:text-[17px] font-montserrat font-[600] text-linkColor break-all"
              to={import.meta.env.VITE_REACT_FRONT_END_URL + "/s/" + `${shortUrl}`}
            >
              {subDomain + "/s/" + `${shortUrl}`}
            </Link>
            <FaExternalLinkAlt className="text-linkColor shrink-0 text-xs sm:text-sm" />
          </div>

          <div className="flex items-center gap-1">
            <h3 className="text-slate-700 font-[400] text-[14px] sm:text-[17px] break-all leading-relaxed">
              {originalUrl}
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-2 pt-6">
            <div className="flex gap-1 items-center font-semibold text-green-800">
              <span>
                <MdOutlineAdsClick className="text-[20px] sm:text-[22px] me-1" />
              </span>
              <span className="text-[14px] sm:text-[16px]">{clickCount}</span>
              <span className="text-[13px] sm:text-[15px]">
                {clickCount === 0 || clickCount === 1 ? "Click" : "Clicks"}
              </span>
            </div>

            <div className="flex items-center gap-2 font-semibold text-slate-800">
              <span>
                <FaRegCalendarAlt className="text-sm sm:text-base" />
              </span>
              <span className="text-[14px] sm:text-[17px]">
                {dayjs(createdDate).format("MMM DD, YYYY")}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-1 sm:justify-end items-center gap-4 flex-wrap">
          <CopyToClipboard
            onCopy={() => setIsCopied(true)}
            text={`${import.meta.env.VITE_REACT_FRONT_END_URL + "/s/" + `${shortUrl}`}`}
          >
            <div className="flex cursor-pointer gap-1 items-center bg-blue-700 hover:bg-blue-800 transition-colors py-2 font-semibold shadow-md shadow-slate-500 px-6 rounded-md text-white">
              <button>{isCopied ? "Copied" : "Copy"}</button>
              {isCopied ? (
                <LiaCheckSolid className="text-md" />
              ) : (
                <IoCopy className="text-md" />
              )}
            </div>
          </CopyToClipboard>

          <div
            onClick={() => setQrVisible(true)}
            className="flex cursor-pointer gap-1 items-center bg-emerald-700 hover:bg-emerald-800 transition-colors py-2 font-semibold shadow-md shadow-slate-500 px-6 rounded-md text-white"
          >
            <button>QR Code</button>
            <FaQrcode className="text-md" />
          </div>

          <div
            onClick={() => analyticsHandler(shortUrl)}
            className="flex cursor-pointer gap-1 items-center bg-rose-700 hover:bg-rose-800 transition-colors py-2 font-semibold shadow-md shadow-slate-500 px-6 rounded-md text-white"
          >
            <button>Analytics</button>
            <MdAnalytics className="text-md" />
          </div>
        </div>
      </div>

      <React.Fragment>
        <div className={`${
          analyticToggle ? "flex" : "hidden"
        } flex-col gap-6 sm:mt-0 mt-5 border-t-2 w-[100%] pt-6 overflow-hidden h-auto`}>
          {loader ? (
            <div className="min-h-[300px] flex justify-center items-center w-full">
              <div className="flex flex-col items-center gap-1">
                <Hourglass
                  visible={true}
                  height="50"
                  width="50"
                  ariaLabel="hourglass-loading"
                  colors={['#306cce', '#72a1ed']}
                />
                <p className="text-slate-700">Please Wait...</p>
              </div>
            </div>
          ) : (
            <>
              {analyticsData.length === 0 ? (
                <div className="flex flex-col justify-center items-center py-10 w-full">
                  <h1 className="text-slate-800 font-montserrat sm:text-2xl text-[15px] font-bold mb-1">
                    No Data For This Time Period
                  </h1>
                  <h3 className="sm:w-96 w-[90%] text-center sm:text-lg text-[12px] text-slate-600">
                    Share your short link to view where your engagements are coming from
                  </h3>
                </div>
              ) : (
                <>
                  <div className="h-64 relative w-full mb-4">
                    <Graph graphData={analyticsData} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-2 mb-6">
                    {renderBreakdownCard("Devices", deviceData)}
                    {renderBreakdownCard("Browsers", browserData)}
                    {renderBreakdownCard("Platforms (OS)", osData)}
                    {renderBreakdownCard("Referrers", referrerData)}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </React.Fragment>

      {qrVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl relative border border-slate-100 flex flex-col items-center">
            <h3 className="text-slate-800 font-bold text-xl mb-4 text-center font-montserrat">QR Code for Short URL</h3>
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(import.meta.env.VITE_REACT_FRONT_END_URL + "/s/" + shortUrl)}`}
              alt="QR Code"
              className="w-48 h-48 border border-slate-200 rounded-lg p-2 bg-slate-50 mb-6"
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
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg text-center cursor-pointer transition-colors font-montserrat"
              >
                Download PNG
              </button>
              <button
                onClick={() => setQrVisible(false)}
                className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold py-2 px-4 rounded-lg text-center cursor-pointer transition-colors font-montserrat"
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