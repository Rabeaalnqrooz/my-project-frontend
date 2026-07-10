// frontend/src/store/orderStore.js

import { create } from "zustand";
import api from "@/api/axios.js";

export const useOrderStore = create((set) => ({
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,

  createOrder: async (orderData) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post("order", orderData);
      set({ currentOrder: res.data.order, isLoading: false });
      return res.data;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  fetchMyOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get("order/my-orders");
      set({ orders: res.data.orders, isLoading: false });
      return res.data;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  fetchOrderById: async (orderId) => {
    set({ isLoading: true, error: null, currentOrder: null });
    try {
      const res = await api.get(`order/${orderId}`);
      set({ currentOrder: res.data.order, isLoading: false });
      return res.data;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  cancelOrder: async (orderId) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.put(`order/${orderId}/cancel`);
      set({ isLoading: false });
      return res.data;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  // ✅ جلب كل الطلبات (أدمن) — مع فلترة اختيارية بالحالة
  fetchAllOrders: async (status) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get("order", {
        params: status ? { status } : {},
      });
      set({ orders: res.data.orders, isLoading: false });
      return res.data;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  // ✅ تغيير حالة طلب (أدمن) — بيحدّث الـ array محلياً بدون إعادة جلب كامل
  updateOrderStatus: async (orderId, status) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.put(`order/${orderId}/status`, { status });
      set((state) => ({
        orders: state.orders.map((order) =>
          order._id === orderId ? res.data.order : order,
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

export default useOrderStore;
