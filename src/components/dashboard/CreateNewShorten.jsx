import React, { useState, useContext } from 'react'

import { ContextApi } from '../../context/ContextApi';

import { useForm } from 'react-hook-form';
import TextField from '../TextField';
import { Tooltip } from '@mui/material';
import { RxCross2 } from 'react-icons/rx';
import api from '../../api/api';
import toast from 'react-hot-toast';

const CreateNewShorten = ({ setOpen, refetch }) => {
    const { token } = useContext(ContextApi);
    const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      originalUrl: "",
      customSlug: "",
      expirationDate: "",
      clickLimit: "",
      password: "",
      oneTime: false,
    },
    mode: "onTouched",
  });

  const createShortUrlHandler = async (data) => {
    setLoading(true);
    try {
        const payload = { ...data };
        if (payload.expirationDate) {
          payload.expirationDate = new Date(payload.expirationDate).toISOString();
        } else {
          payload.expirationDate = null;
        }

        const { data: res } = await api.post("/api/urls/shorten", payload, {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: "Bearer " + token,
            },
          });

          const shortenUrl = `${import.meta.env.VITE_REACT_SUBDOMAIN + "/s/" + `${res.shortUrl}`}`;
          navigator.clipboard.writeText(shortenUrl).then(() => {
            toast.success("Short URL Copied to Clipboard", {
                position: "bottom-center",
                className: "mb-5",
                duration: 3000,
            });
          });

          if (refetch) {
              await refetch();
          }
          reset();
          setOpen(false);
    } catch (error) {
        const errorMsg = error.response?.data?.message || "Create ShortURL Failed";
        toast.error(errorMsg);
    } finally {
        setLoading(false);
    }
  };


  return (
    <div className="flex justify-center items-center bg-white">
      <form
        onSubmit={handleSubmit(createShortUrlHandler)}
        className="w-[95vw] max-w-[480px] sm:w-[480px] relative border border-slate-200/80 pt-7 pb-6 sm:px-8 px-5 rounded-2xl bg-white flex flex-col gap-4 font-montserrat shadow-lg"
      >
        <h2 className="font-bold text-center text-lg text-slate-800 tracking-tight">
          Create New Short Link
        </h2>

        <div className="flex flex-col gap-4">
          <TextField
            label="Enter Destination URL"
            required
            id="originalUrl"
            placeholder="https://example.com/very-long-link"
            type="url"
            message="Destination URL is required"
            register={register}
            errors={errors}
          />

          <TextField
            label="Custom Alias (Optional)"
            id="customSlug"
            placeholder="e.g. custom-slug"
            type="text"
            register={register}
            errors={errors}
            validationPattern={{
              value: /^[a-zA-Z0-9\-_]+$/,
              message: "Only letters, numbers, hyphens, and underscores are allowed",
            }}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextField
              label="Expiration Date (Optional)"
              id="expirationDate"
              type="datetime-local"
              register={register}
              errors={errors}
            />

            <TextField
              label="Click Limit (Optional)"
              id="clickLimit"
              placeholder="e.g. 100"
              type="number"
              register={register}
              errors={errors}
              validationPattern={{
                value: /^[1-9]\d*$/,
                message: "Must be a positive integer",
              }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <TextField
              label="Password (Optional)"
              id="password"
              placeholder="e.g. secret-123"
              type="password"
              register={register}
              errors={errors}
            />

            <div className="flex flex-col gap-0.5 justify-center pt-3 select-none">
              <label htmlFor="oneTime" className="font-semibold text-xs text-slate-700 cursor-pointer flex items-center gap-2">
                <input
                  type="checkbox"
                  id="oneTime"
                  className="w-4 h-4 cursor-pointer accent-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                  {...register("oneTime")}
                />
                <span>One-time Link</span>
              </label>
              <p className="text-[10px] text-slate-400">Deactivates after the first redirect visit.</p>
            </div>
          </div>
        </div>

        <button
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl transition-all cursor-pointer text-sm w-full mt-2 shadow-sm flex justify-center items-center"
          type="submit"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Short Link"}
        </button>

        {!loading && (
          <Tooltip title="Close">
            <button
              type="button"
              disabled={loading}
              onClick={() => setOpen(false)}
              className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <RxCross2 className="text-2xl" />
            </button>
          </Tooltip>
        )}

      </form>
    </div>
  )
}

export default CreateNewShorten