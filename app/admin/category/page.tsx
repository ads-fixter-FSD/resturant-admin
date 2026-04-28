/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, FormEvent } from "react";
import {
  IoAddOutline,
  IoCreateOutline,
  IoEyeOutline,
  IoEyeOffOutline,
  IoCloseOutline,
  IoLayersOutline,
} from "react-icons/io5";

import {
  getAllCategoriesForAdminApi,
  createCategoryApi,
  updateCategoryApi,
} from "@/app/modules/category/category.api";
import toast from "react-hot-toast";

// --- Skeleton Component for better UX ---
const CategorySkeleton = () => (
  <div className="w-full space-y-4 p-4 animate-pulse">
    {[1, 2, 3, 4, 5].map((i) => (
      <div key={i} className="h-16 bg-gray-100 rounded-2xl w-full" />
    ))}
  </div>
);

const CategoryPage: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [btnLoading, setBtnLoading] = useState<boolean>(false);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [catName, setCatName] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<number>(1);
  const [status, setStatus] = useState<string>("active");

  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const fetchCategories = async (): Promise<void> => {
    setLoading(true);
    try {
      const data = await getAllCategoriesForAdminApi();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (err: any) {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      const res = await updateCategoryApi(id, { status: newStatus });
      if (res.success) {
        toast.success(`Category is now ${newStatus}`);
        fetchCategories();
      }
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const openModal = (category: any | null = null) => {
    if (category) {
      setIsEditMode(true);
      setSelectedId(category._id);
      setCatName(category.name);
      setSortOrder(category.sortOrder);
      setStatus(category.status);
    } else {
      setIsEditMode(false);
      setCatName("");
      setSortOrder(categories.length + 1);
      setStatus("active");
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    setBtnLoading(true);
    try {
      const payload = { name: catName, sortOrder: Number(sortOrder), status };
      let res;
      if (isEditMode && selectedId) {
        res = await updateCategoryApi(selectedId, payload);
      } else {
        res = await createCategoryApi(payload);
      }

      if (res.success) {
        toast.success(isEditMode ? "Category updated!" : "Category created!");
        setIsModalOpen(false);
        fetchCategories();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Operation failed");
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full pb-10">
      {/* Header Area */}
      <div className="max-w-6xl mx-auto mb-8 flex flex-col sm:flex-row justify-between items-center gap-6 px-4">
        <div className="text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
            <div className="p-2 bg-[#1A4E11]/10 text-[#1A4E11] rounded-lg">
              <IoLayersOutline size={20} />
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 uppercase italic tracking-tighter">
              Category <span className="text-[#1A4E11]">List</span>
            </h1>
          </div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[3px] ml-1">
            Product Taxonomy Management
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#1A4E11] text-white px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:shadow-2xl hover:shadow-green-900/20 transition-all active:scale-95 shadow-xl shadow-green-900/10"
        >
          <IoAddOutline size={20} /> Add New Category
        </button>
      </div>

      {/* Content Container */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden">
          {loading ? (
            <CategorySkeleton />
          ) : categories.length === 0 ? (
            <div className="p-20 text-center">
              <p className="text-xs font-black text-gray-300 uppercase tracking-widest">
                No categories available
              </p>
            </div>
          ) : (
            <>
              {/* Mobile View (Cards) */}
              <div className="md:hidden divide-y divide-gray-50">
                {categories.map((cat) => (
                  <div
                    key={cat._id}
                    className="p-6 hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-black text-gray-900 text-base uppercase tracking-tight">
                          {cat.name}
                        </h3>
                        <p className="text-[10px] font-bold text-gray-400 mt-1">
                          SORT ORDER: {cat.sortOrder}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-tighter ${
                          cat.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {cat.status}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openModal(cat)}
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-100 text-gray-600 rounded-xl font-black text-[10px] uppercase transition-all active:bg-[#1A4E11] active:text-white"
                      >
                        <IoCreateOutline size={16} /> Edit
                      </button>
                      <button
                        onClick={() => handleToggleStatus(cat._id, cat.status)}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-[10px] uppercase transition-all ${
                          cat.status === "active"
                            ? "bg-orange-50 text-orange-600"
                            : "bg-green-50 text-green-600"
                        }`}
                      >
                        {cat.status === "active" ? (
                          <IoEyeOffOutline size={16} />
                        ) : (
                          <IoEyeOutline size={16} />
                        )}
                        {cat.status === "active" ? "Disable" : "Enable"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop View (Table) */}
              <div className="hidden md:block">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">
                      <th className="p-7">Category Identity</th>
                      <th className="p-7 text-center">Priority Order</th>
                      <th className="p-7 text-center">Status</th>
                      <th className="p-7 text-right">Operations</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {categories.map((cat) => (
                      <tr
                        key={cat._id}
                        className="group hover:bg-gray-50/30 transition-all"
                      >
                        <td className="p-7">
                          <span className="font-black text-gray-800 text-sm uppercase tracking-tight group-hover:text-[#1A4E11] transition-colors">
                            {cat.name}
                          </span>
                        </td>
                        <td className="p-7 text-center">
                          <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-50 rounded-lg text-[11px] font-black text-gray-500">
                            {cat.sortOrder}
                          </span>
                        </td>
                        <td className="p-7 text-center">
                          <span
                            className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider shadow-sm ${
                              cat.status === "active"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {cat.status}
                          </span>
                        </td>
                        <td className="p-7">
                          <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                            <button
                              title={
                                cat.status === "active"
                                  ? "Disable Category"
                                  : "Enable Category"
                              }
                              onClick={() =>
                                handleToggleStatus(cat._id, cat.status)
                              }
                              className="w-10 h-10 flex items-center justify-center bg-white shadow-md border border-gray-50 rounded-xl text-gray-400 hover:text-orange-500 hover:border-orange-100 transition-all"
                            >
                              {cat.status === "active" ? (
                                <IoEyeOffOutline size={18} />
                              ) : (
                                <IoEyeOutline size={18} />
                              )}
                            </button>
                            <button
                              title="Edit Details"
                              onClick={() => openModal(cat)}
                              className="w-10 h-10 flex items-center justify-center bg-white shadow-md border border-gray-100 rounded-xl text-gray-400 hover:text-[#1A4E11] hover:border-green-100 transition-all"
                            >
                              <IoCreateOutline size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal - Fully Responsive */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-t-[2.5rem] sm:rounded-[2rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-300">
            <div className="p-6 md:p-8 flex justify-between items-center border-b border-gray-50">
              <div>
                <h2 className="text-xl font-black text-gray-900 uppercase italic tracking-tighter">
                  {isEditMode ? "Modify" : "New"}{" "}
                  <span className="text-[#1A4E11]">Category</span>
                </h2>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                  Database Entry Form
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all"
              >
                <IoCloseOutline size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-[2px]">
                  Category Display Name
                </label>
                <input
                  type="text"
                  required
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  className="w-full bg-gray-50/50 border border-gray-100 p-4 rounded-2xl outline-none focus:bg-white focus:border-[#1A4E11] focus:shadow-xl focus:shadow-green-900/5 transition-all font-bold text-sm text-gray-800"
                  placeholder="e.g. Italian Pasta"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-[2px]">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(Number(e.target.value))}
                    className="w-full bg-gray-50/50 border border-gray-100 p-4 rounded-2xl outline-none focus:bg-white focus:border-[#1A4E11] transition-all font-bold text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-[2px]">
                    Visibility
                  </label>
                  <div className="relative">
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full bg-gray-50/50 border border-gray-100 p-4 rounded-2xl outline-none focus:bg-white focus:border-[#1A4E11] transition-all font-black text-[10px] uppercase appearance-none cursor-pointer"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      <IoLayersOutline size={14} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  disabled={btnLoading}
                  className="w-full bg-[#1A4E11] text-white py-5 rounded-[1.25rem] font-black uppercase tracking-[0.3em] text-[11px] shadow-2xl shadow-green-900/20 active:scale-95 transition-all disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none flex items-center justify-center gap-3"
                >
                  {btnLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Save Configuration"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
