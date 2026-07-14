import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import api from "@/api/axios";

export const useAuthStore = create(
  persist(
    (set) => ({
      // ─── State ────────────────────────────────────────────
      user: null,
      isLoading: false,
      error: null,

      // ─── Actions ──────────────────────────────────────────

      // ✅ تسجيل مستخدم جديد
      register: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const res = await api.post("user/register", data);
          set({ isLoading: false });
          return res.data;
        } catch (error) {
          set({ isLoading: false, error: error.message });
          throw error;
        }
      },

      // ✅ تسجيل الدخول
      login: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const res = await api.post("user/login", data);
          set({ user: res.data.user, isLoading: false });
          return res.data;
        } catch (error) {
          set({ isLoading: false, error: error.message });
          throw error;
        }
      },

      // ✅ جلب بيانات المستخدم الحالي
      getMe: async () => {
        set({ isLoading: true });
        try {
          const res = await api.get("user/me");
          set({ user: res.data.user, isLoading: false });
          return res.data;
        } catch (error) {
          set({ user: null, isLoading: false });
          throw error;
        }
      },

      // ✅ تسجيل الخروج (تمت إزالة الشرطة المائلة الزائدة هنا)
      logout: async () => {
        set({ isLoading: true });
        try {
          await api.post("user/logout");
          set({ user: null, isLoading: false });
        } catch (error) {
          set({ isLoading: false, error: error.message });
          throw error;
        }
      },

      //  ✅ تحديث الملف الشخصي
      updateProfile: async (formData) => {
        set({ isLoading: true, error: null });
        try {
          const res = await api.put("user/update-profile", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          set({ user: res.data.user, isLoading: false });
          return res.data;
        } catch (error) {
          set({ isLoading: false, error: error.message });
          throw error;
        }
      },

      // ✅ تغيير كلمة المرور
      updatePassword: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const res = await api.put("user/update-password", data);
          set({ isLoading: false });
          return res.data;
        } catch (error) {
          set({ isLoading: false, error: error.message });
          throw error;
        }
      },

      // ✅ طلب OTP لإعادة تعيين كلمة المرور
      forgotPassword: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const res = await api.post("user/forgot-password", data);
          set({ isLoading: false });
          return res.data;
        } catch (error) {
          set({ isLoading: false, error: error.message });
          throw error;
        }
      },

      // ✅ التحقق من OTP
      verifyResetOTP: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const res = await api.post("user/verify-reset-otp", data);
          set({ isLoading: false });
          return res.data;
        } catch (error) {
          set({ isLoading: false, error: error.message });
          throw error;
        }
      },

      // ✅ إعادة إرسال رمز الـ OTP
      resendResetOTP: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const res = await api.post("user/resend-reset-otp", data);
          set({ isLoading: false });
          return res.data;
        } catch (error) {
          set({ isLoading: false, error: error.message });
          throw error;
        }
      },

      // ✅ إعادة تعيين كلمة المرور
      resetPassword: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const res = await api.post("user/reset-password", data);
          set({ isLoading: false });
          return res.data;
        } catch (error) {
          set({ isLoading: false, error: error.message });
          throw error;
        }
      },

      // ✅ مسح الأخطاء
      clearError: () => set({ error: null }),
      hasHydrated: () => useAuthStore.persist.hasHydrated(),
    }),
    {
      name: "auth",
      storage: createJSONStorage(() => localStorage), // ✅ يضمن التوافق التام أونلاين مع المتصفح
    },
  ),
);

export default useAuthStore;
