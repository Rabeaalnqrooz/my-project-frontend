// frontend/src/store/productStore.js
import { create } from "zustand";
import api from "@/api/axios";

export const useProductStore = create((set, get) => ({
  products: [],
  currentProduct: null,
  totalPages: 1,
  currentPage: 1,
  total: 0,
  isLoading: false,
  error: null,

  fetchProducts: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get("product", { params: filters });
      set({
        products: res.data.products,
        totalPages: res.data.totalPages,
        currentPage: res.data.currentPage,
        total: res.data.total,
        isLoading: false,
      });
      return res.data;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  fetchProductBySlug: async (slug) => {
    set({ isLoading: true, error: null, currentProduct: null });
    try {
      const res = await api.get(`product/${slug}`);
      set({ currentProduct: res.data.product, isLoading: false });
      return res.data;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  clearCurrentProduct: () => set({ currentProduct: null }),

  // ➕ إضافة تقييم جديد للـ Backend
  addReview: async (productId, { rating, comment }) => {
    try {
      const res = await api.post(`product/${productId}/reviews`, {
        rating,
        comment,
      });

      // تحديث المنتج الحالي بالمراجعات الجديدة والنسبة الجديدة
      set((state) => {
        if (!state.currentProduct) return state;
        return {
          currentProduct: {
            ...state.currentProduct,
            reviews: res.data.reviews,
            rating: res.data.rating,
            numReviews: res.data.numReviews,
          },
        };
      });
      return res.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  // 🗑️ حذف تقييم عبر الـ Backend (أدمن فقط)
  deleteReview: async (productId, reviewId) => {
    try {
      const res = await api.delete(`product/${productId}/reviews/${reviewId}`);

      set((state) => {
        if (!state.currentProduct) return state;
        return {
          currentProduct: {
            ...state.currentProduct,
            reviews: res.data.reviews,
            rating: res.data.rating,
            numReviews: res.data.numReviews,
          },
        };
      });
      return res.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  createProduct: async (formData) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post("product", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      set((state) => ({
        products: [res.data.product, ...state.products],
        isLoading: false,
      }));
      return res.data;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  updateProduct: async (id, formData) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.put(`product/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      set((state) => ({
        products: state.products.map((p) =>
          p._id === id ? res.data.product : p,
        ),
        isLoading: false,
      }));
      return res.data;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },
}));

export default useProductStore;
