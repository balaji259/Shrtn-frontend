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
        const { data: res } = await api.post("/api/urls/shorten", data, {
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
    <div className=" flex justify-center items-center bg-white rounded-md">
    <form
        onSubmit={handleSubmit(createShortUrlHandler)}
        className="w-[90vw] max-w-[500px] sm:w-[500px] relative  shadow-custom pt-8 pb-5 sm:px-8 px-4 rounded-lg"
      >

        <h1 className="font-montserrat sm:mt-0 mt-3 text-center  font-bold sm:text-2xl text-[22px] text-slate-800 ">
                Create New Shorten Url
        </h1>

        <hr className="mt-2 sm:mb-5 mb-3 text-slate-950" />

        <div className="flex flex-col gap-4">
          <TextField
            label="Enter URL"
            required
            id="originalUrl"
            placeholder="https://example.com"
            type="url"
            message="Url is required"
            register={register}
            errors={errors}
          />

          <TextField
            label="Custom Alias (Optional)"
            id="customSlug"
            placeholder="e.g. my-slug"
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextField
              label="Password Protection (Optional)"
              id="password"
              placeholder="e.g. secret-pwd"
              type="password"
              register={register}
              errors={errors}
            />

            <div className="flex flex-col gap-1 justify-center pt-2 select-none">
              <label htmlFor="oneTime" className="font-semibold text-md cursor-pointer flex items-center gap-2">
                <input
                  type="checkbox"
                  id="oneTime"
                  className="w-5 h-5 cursor-pointer accent-blue-600 rounded border-slate-600 focus:ring-blue-500"
                  {...register("oneTime")}
                />
                <span>One-time Link</span>
              </label>
              <p className="text-slate-500 text-xs leading-relaxed">Deactivates instantly after the first visit.</p>
            </div>
          </div>
        </div>

        <button
          className="bg-blue-700 font-semibold text-white w-32  bg-custom-gradient  py-2  transition-colors  rounded-md my-3 mt-5 cursor-pointer hover:bg-blue-800"
          type="submit"
        >
          {loading ? "Loading..." : "Create"}
        </button>

        {!loading && (
          <Tooltip title="Close">
            <button
              disabled={loading}
              onClick={() => setOpen(false)}
              className=" absolute right-2 top-2  "
            >
              <RxCross2 className="text-slate-800   text-3xl" />
            </button>
          </Tooltip>
        )}

      </form>
    </div>
  )
}

export default CreateNewShorten