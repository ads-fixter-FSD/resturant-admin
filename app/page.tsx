/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import AuthForm from "@/components/AuthForm";
import { IoShieldCheckmarkOutline, IoLockClosedOutline } from "react-icons/io5";

const AdminLoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });


  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      setErrors({});
    }
  }, [formData]);

  const validate = () => {
    const newErrors: any = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fill up the email and password field");
      return;
    }

    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (res?.error) {
        toast.error(
          res.error === "CredentialsSignin"
            ? "Invalid Email or Password"
            : res.error,
        );
        setLoading(false);
        return;
      }

      // Session role check
      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();

      if (session?.user?.role !== "admin") {
        toast.error("Access Denied: You are not an admin!");
        setLoading(false);
        return;
      }

      toast.success("Welcome back, Admin!");
      router.push("/admin");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F7F4] p-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-5%] w-64 h-64 bg-[#1A4E11]/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-[#1A4E11]/10 rounded-full blur-3xl"></div>

      <div className="bg-white/80 backdrop-blur-md p-8 md:p-12 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] w-full max-w-md border border-white/20 relative z-10">
        {/* Logo or Icon Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-[#1A4E11] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-green-900/20 mb-4 rotate-3">
            <IoShieldCheckmarkOutline size={32} />
          </div>
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter italic">
            Admin <span className="text-[#1A4E11]">Portal</span>
          </h2>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[3px] mt-2">
            Secure Infrastructure Access
          </p>
        </div>

        {/* Form Section */}
        <div className="space-y-4">
          <AuthForm
            isLogin={true}
            loading={loading}
            onSubmit={handleSubmit}
            formData={formData}
            setFormData={setFormData}
            errors={errors}
          />
        </div>

        {/* Footer Info */}
        <div className="mt-8 pt-6 border-t border-dashed border-gray-100 flex items-center justify-center gap-2 text-gray-400">
          <IoLockClosedOutline size={12} />
          <p className="text-[9px] font-black uppercase tracking-widest">
            End-to-End Encrypted Session
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
