// frontend/src/store/dashboardStore.js

import { create } from "zustand";
import api from "@/api/axios";

export const useDashboardStore = create((set) => ({
  stats: null,
  isLoading: false,
  error: null,

  fetchStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get("dashboard/stats");
      set({ stats: res.data.stats, isLoading: false });
      return res.data;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },
}));

export default useDashboardStore;
