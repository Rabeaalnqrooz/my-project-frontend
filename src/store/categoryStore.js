// frontend/src/store/categoryStore.js

import { create } from "zustand";
import api from "@/api/axios";

export const useCategoryStore = create((set) => ({
  categories: [],
  isLoading: false,
  error: null,

  fetchCategories: async (all = false) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get("category", {
        params: all ? { all: true } : {},
      });
      set({ categories: res.data.categories, isLoading: false });
      return res.data;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  // ✅ إنشاء تصنيف — formData لأنها ممكن تحتوي صورة
  createCategory: async (formData) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post("category", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      set((state) => ({
        categories: [...state.categories, res.data.category],
        isLoading: false,
      }));
      return res.data;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  updateCategory: async (id, formData) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.put(`category/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      set((state) => ({
        categories: state.categories.map((cat) =>
          cat._id === id ? res.data.category : cat,
        ),
        isLoading: false,
      }));
      return res.data;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  deleteCategory: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`category/${id}`);
      set((state) => ({
        categories: state.categories.filter((cat) => cat._id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },
}));

export default useCategoryStore;
