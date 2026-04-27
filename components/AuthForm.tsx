/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import React, { useState } from "react";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

interface AuthFormProps {
  isLogin: boolean;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  formData: any;
  setFormData: (data: any) => void;
  errors: any;
}

const AuthForm: React.FC<AuthFormProps> = ({
  isLogin,
  loading,
  onSubmit,
  formData,
  setFormData,
  errors,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // কমন ইনপুট স্টাইল
  const inputBaseStyles = `w-full h-12.5 md:h-13.75 px-4 bg-gray-50/50 border rounded-xl outline-none transition-all text-sm font-medium`;
  const errorBorder = "border-red-500/50 focus:border-red-500 bg-red-50/10";
  const normalBorder = "border-gray-100 focus:border-[#1a4e11] focus:bg-white focus:shadow-sm";

  return (
    <form className="flex flex-col gap-4 w-full" onSubmit={onSubmit}>
      {!isLogin && (
        <>
          {/* Full Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-black uppercase tracking-widest text-gray-400 ml-1">Full Name</label>
            <input
              name="name"
              type="text"
              placeholder="e.g. John Doe"
              value={formData.name || ""}
              onChange={handleChange}
              className={`${inputBaseStyles} ${errors.name ? errorBorder : normalBorder}`}
            />
            {errors.name && (
              <span className="text-red-500 text-[10px] font-bold flex items-center gap-1 ml-1 animate-in fade-in slide-in-from-left-1">
                <AlertCircle size={10} /> {errors.name}
              </span>
            )}
          </div>

          {/* Phone Number */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-black uppercase tracking-widest text-gray-400 ml-1">Phone Number</label>
            <input
              name="phone"
              type="text"
              placeholder="017XXXXXXXX"
              value={formData.phone || ""}
              onChange={handleChange}
              className={`${inputBaseStyles} ${errors.phone ? errorBorder : normalBorder}`}
            />
            {errors.phone && (
              <span className="text-red-500 text-[10px] font-bold flex items-center gap-1 ml-1 animate-in fade-in slide-in-from-left-1">
                <AlertCircle size={10} /> {errors.phone}
              </span>
            )}
          </div>
        </>
      )}

      {/* Email Address */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[12px] font-black uppercase tracking-widest text-gray-400 ml-1">Email Address</label>
        <input
          name="email"
          type="email"
          placeholder="admin@savorynest.com"
          value={formData.email || ""}
          onChange={handleChange}
          className={`${inputBaseStyles} ${errors.email ? errorBorder : normalBorder}`}
        />
        {errors.email && (
          <span className="text-red-500 text-[10px] font-bold flex items-center gap-1 ml-1 animate-in fade-in slide-in-from-left-1">
            <AlertCircle size={10} /> {errors.email}
          </span>
        )}
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[12px] font-black uppercase tracking-widest text-gray-400 ml-1">Password</label>
        <div className="relative group">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={formData.password || ""}
            onChange={handleChange}
            className={`${inputBaseStyles} pr-12 ${errors.password ? errorBorder : normalBorder}`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-[#1a4e11] transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && (
          <span className="text-red-500 text-[10px] font-bold flex items-center gap-1 ml-1 animate-in fade-in slide-in-from-left-1">
            <AlertCircle size={10} /> {errors.password}
          </span>
        )}
      </div>

      {/* Remember me & Forgot Password */}
      <div className="flex justify-between items-center mt-2 px-1">
        <label className="flex items-center gap-2 cursor-pointer group">
          <div className="relative flex items-center">
            <input 
              type="checkbox" 
              className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-gray-200 checked:bg-[#1a4e11] checked:border-[#1a4e11] transition-all" 
            />
            <span className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </span>
          </div>
          <span className="text-[12px] font-bold text-gray-500 group-hover:text-gray-700 transition-colors uppercase tracking-wider">Remember me</span>
        </label>
        {isLogin && (
          <Link href="/forgot-password">
            <span className="text-[12px] font-bold text-[#1a4e11] hover:text-black transition-colors uppercase tracking-wider">
              Forgot password?
            </span>
          </Link>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full h-12.5 md:h-13.75 bg-[#1a4e11] text-white rounded-xl mt-4 font-black uppercase text-xs tracking-[0.2em] shadow-lg shadow-green-900/20 active:scale-95 disabled:bg-gray-200 disabled:shadow-none cursor-pointer disabled:text-gray-400 disabled:scale-100 transition-all flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <span>Processing...</span>
          </>
        ) : (
          isLogin ? "Secure Login" : "Create Account"
        )}
      </button>
    </form>
  );
};

export default AuthForm;