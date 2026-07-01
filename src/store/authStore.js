import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "@/api/axios";

export const useAuthStore = create(
  persist((set) => ({
    // ─── State ────────────────────────────────────────────
    user: null, // بيانات المستخدم الحالي
    isLoading: false, // لإظهار spinner أثناء الطلبات
    error: null, // رسالة الخطأ
    // ─── Actions ──────────────────────────────────────────

    // ✅ تسجيل مستخدم جديد
    register: async (data) => {
      set({ isLoading: true, error: null });
      try {
        const res = await api.post("user/register", data);
        set({ isLoading: false });
        return res.data; // نرجع البيانات للصفحة عشان تعرض رسالة النجاح
      } catch (error) {
        set({ isLoading: false, error: error.message });
        throw error; // نرمي الخطأ للصفحة عشان تعرض Toast
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
    // ✅ تسجيل الخروج
    logout: async () => {
      set({ isLoading: true });
      try {
        await api.post("/user/logout");
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
        return res.data; // يحتوي على resetToken
      } catch (error) {
        set({ isLoading: false, error: error.message });
        throw error;
      }
    },
    // ✅ إعادة إرسال رمز الـ OTP
    resendResetOTP: async (data) => {
      set({ isLoading: true, error: null });
      try {
        // تأكد أن الرابط يطابق الـ Route الذي حددته في الـ Backend (مثلاً: user/resend-otp)
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
  })),
  { name: "auth" },
);
export default useAuthStore;
