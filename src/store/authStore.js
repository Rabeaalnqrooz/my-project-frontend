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
      // register: async (data) => {
      //   set({ isLoading: true, error: null });
      //   try {
      //     const res = await api.post("user/register", data);
      //     set({ isLoading: false });
      //     return res.data;
      //   } catch (error) {
      //     set({ isLoading: false, error: error.message });
      //     throw error;
      //   }
      // },
      register: async (data) => {
        set({ isLoading: true, error: null });
        try {
          // ─── الخطوة 1: إنشاء الحساب ───────────────────────────────
          await api.post("user/register", data);

          // ─── الخطوة 2: تسجيل دخول تلقائي فوراً بنفس البيانات ───────
          // ⚠️ هاي الخطوة بتنجح فقط لو الحساب اتفعّل تلقائياً بالباك اند
          // (يعني REQUIRE_EMAIL_VERIFICATION=false) — لو رجّعت التحقق بالبريد
          // لوضعه الطبيعي بالمستقبل، هاي الخطوة رح تفشل بخطأ "لم يتم التحقق من بريدك"
          // ووقتها لازم تشيل هالجزء وترجع للسلوك القديم (تسجيل بس، بدون دخول تلقائي)
          const loginRes = await api.post("user/login", {
            email: data.email,
            password: data.password,
          });

          set({ user: loginRes.data.user, isLoading: false });
          return loginRes.data;
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
