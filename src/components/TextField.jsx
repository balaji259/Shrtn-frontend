import React from "react";

const TextField = ({
    label,
    id,
    type,
    errors,
    register,
    required,
    message,
    className,
    min,
    placeholder,
    validationPattern,
  }) => {
    return (
      <div className="flex flex-col">
        <label
          htmlFor={id}
          className={`${className ? className : ""} text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5`}
        >
          {label}
        </label>
  
        <input
          type={type}
          id={id}
          placeholder={placeholder}
          className={`${
            className ? className : ""
          } w-full bg-slate-50/50 border px-3.5 py-2.5 text-slate-800 placeholder-slate-400 text-sm rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all ${
            errors[id]?.message ? "border-red-400 focus:border-red-400 focus:ring-red-400" : "border-slate-200"
          }`}
          {...register(id, {
            required: { value: required, message },
            minLength: min
              ? { value: min, message: "Minimum 6 characters is required" }
              : null,
  
            pattern: validationPattern
              ? validationPattern
              : type === "email"
                ? {
                    value: /^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+com+$/,
                    message: "Invalid email",
                  }
                : type === "url"
                ? {
                    value:
                      /^(https?:\/\/)?(([a-zA-Z0-9\u00a1-\uffff-]+\.)+[a-zA-Z\u00a1-\uffff]{2,})(:\d{2,5})?(\/[^\s]*)?$/,
                    message: "Please enter a valid url",
                  }
                : null,
          })}
        />
  
        {errors[id]?.message && (
          <p className="text-xs font-semibold text-red-500 mt-1">
            {errors[id]?.message}*
          </p>
        )}
      </div>
    );
  };
  
  export default TextField;