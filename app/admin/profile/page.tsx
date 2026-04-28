/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import {
  IoCameraOutline,
  IoPersonOutline,
  IoCallOutline,
  IoMailOutline,
  IoSaveOutline,
  IoLockClosedOutline,
  IoEyeOutline,
  IoEyeOffOutline,
  IoLocationOutline,
  IoCreateOutline,
} from "react-icons/io5";
import {
  getMeApi,
  updateProfileApi,
  changePasswordApi,
} from "@/app/modules/auth/auth.api";

const AdminProfilePage = () => {
  const { data: session, update } = useSession();

  // ── Your Provided States ──
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "" });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);


  // ── Load Profile Logic ──
  const loadProfile = useCallback(async () => {
    const userId = session?.user?.id;
    if (!userId) return;

    try {
      setLoading(true);
      const res: any = await getMeApi(userId);
      console.log(res)
      if (res.success && res.data) {
        const profileData = res.data.user || res.data;
        setUser(profileData);
        setFormData({
          name: profileData.name || "",
          phone: profileData.phone || "",
        });
        setImagePreview(profileData.image || "");
      }
    } catch {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
    // ২. ডিপেন্ডেন্সি হিসেবে শুধু session দিন, কম্পাইলার এটাই পছন্দ করে
  }, [session]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  // ── Handle Image Change ──
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // ── Profile Update Logic ──
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setUpdateLoading(true);
      const payload = new FormData();
      payload.append("userId", session?.user?.id as string);
      payload.append("name", formData.name);
      payload.append("phone", formData.phone);
      if (imageFile) payload.append("image", imageFile);

      const res: any = await updateProfileApi(payload);
      if (res.success) {
        const updatedUser = res.data?.user || res.data;
        await update({
          ...session,
          user: {
            ...session?.user,
            name: formData.name,
            image: updatedUser.image,
            phone: formData.phone,
          },
        });
        toast.success("Profile Updated & Synced!");
        setUser(updatedUser);
        setIsEditing(false);
        setImageFile(null);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Update failed!");
    } finally {
      setUpdateLoading(false);
    }
  };

  // ── Password Change Logic ──
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters!");
      return;
    }
    try {
      setPasswordLoading(true);
      const res = await changePasswordApi({
        oldPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      if (res.success) {
        toast.success("Password changed successfully!");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Password change failed!");
    } finally {
      setPasswordLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen animate-pulse font-black text-gray-400">
        LOADING CORE...
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10">
      {/* Page Title */}
      <div className="border-l-8 border-gray-900 pl-6">
        <h1 className="text-4xl font-black text-gray-900 uppercase italic tracking-tighter leading-none">
          Security Center
        </h1>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[4px] mt-2">
          Administrative Profile Management
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-2 bg-white rounded-[40px] border border-gray-100 shadow-sm p-8 overflow-hidden relative">
          <div className="flex flex-col md:flex-row gap-10">
            {/* Image Sec */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative group">
                <div className="w-40 h-40 rounded-[48px] overflow-hidden border-4 border-gray-50 shadow-xl bg-gray-50">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Admin"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <IoPersonOutline
                      size={60}
                      className="m-auto mt-10 text-gray-200"
                    />
                  )}
                </div>
                {isEditing && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-2 right-2 p-3 bg-gray-900 text-white rounded-2xl shadow-lg hover:scale-110 transition-transform"
                  >
                    <IoCameraOutline size={20} />
                  </button>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="hidden"
                  accept="image/*"
                />
              </div>
            </div>

            {/* Info Sec */}
            <div className="flex-1 space-y-6">
              {!isEditing ? (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-3xl font-black text-gray-900">
                      {user?.name}
                    </h2>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-black uppercase tracking-widest">
                      {user?.role}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 text-gray-500 bg-gray-50 p-3 rounded-2xl">
                      <IoMailOutline className="text-gray-900" />
                      <span className="text-xs font-bold">{user?.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-500 bg-gray-50 p-3 rounded-2xl">
                      <IoCallOutline className="text-gray-900" />
                      <span className="text-xs font-bold">
                        {user?.phone || "No phone added"}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 text-xs font-black uppercase bg-gray-900 text-white px-6 py-3 rounded-xl hover:bg-gray-700 transition-all"
                  >
                    <IoCreateOutline size={16} /> Edit Profile
                  </button>
                </div>
              ) : (
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-2">
                        Name
                      </label>
                      <input
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-xs font-bold focus:ring-2 focus:ring-gray-900"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-2">
                        Phone
                      </label>
                      <input
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-xs font-bold focus:ring-2 focus:ring-gray-900"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      disabled={updateLoading}
                      type="submit"
                      className="flex-1 bg-green-700 text-white py-3 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-green-800 transition-all"
                    >
                      {updateLoading ? "Saving..." : "Save Identity"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="flex-1 bg-gray-100 text-gray-500 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Security / Password Form */}
        <div className="space-y-6">
          <form
            onSubmit={handlePasswordChange}
            className="bg-gray-900 rounded-[40px] p-8 text-white shadow-2xl space-y-6"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-xl text-amber-400">
                <IoLockClosedOutline size={20} />
              </div>
              <h3 className="font-black uppercase text-sm italic">
                Credential Update
              </h3>
            </div>

            <div className="space-y-4">
              {[
                {
                  label: "Current Password",
                  key: "currentPassword",
                  show: showCurrentPass,
                  setShow: setShowCurrentPass,
                },
                {
                  label: "New Password",
                  key: "newPassword",
                  show: showNewPass,
                  setShow: setShowNewPass,
                },
                {
                  label: "Confirm Password",
                  key: "confirmPassword",
                  show: showConfirmPass,
                  setShow: setShowConfirmPass,
                },
              ].map((field) => (
                <div key={field.key} className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-gray-500 ml-1">
                    {field.label}
                  </label>
                  <div className="relative">
                    <input
                      type={field.show ? "text" : "password"}
                      minLength={6}
                      value={(passwordData as any)[field.key]}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          [field.key]: e.target.value,
                        })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs font-bold focus:ring-2 focus:ring-amber-500 outline-none"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => field.setShow(!field.show)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                    >
                      {field.show ? <IoEyeOffOutline /> : <IoEyeOutline />}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              disabled={passwordLoading}
              className="w-full bg-amber-500 hover:bg-amber-600 text-black py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-lg shadow-amber-900/20"
            >
              {passwordLoading ? "Processing..." : "Update Credentials"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminProfilePage;
