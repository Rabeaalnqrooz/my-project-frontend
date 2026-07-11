import axios from "axios";

const api = axios.create({
  // ✅ أضفنا مسار الإصدار الأساسي للـ API ليتوافق مع السيرفر
  baseURL: `${import.meta.env.VITE_API_URL}/api/v1`,
  // ✅ ضروري جداً — يرسل الـ Cookies تلقائياً (accessToken و refreshToken) مع كل طلب
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// ─── Request Interceptor ─────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error),
);

// ─── Response Interceptor المطور ──────────────────────────────
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;
    const message =
      error.response?.data?.message || error.message || "حدث خطأ غير متوقع";

    // 1️⃣ تحديد مسارات التحقق لمنع تكرار الطلبات عليها
    const authRoutes = [
      "user/login",
      "user/register",
      "user/forgot-password",
      "user/refresh-token",
    ];

    const isAuthRoute = authRoutes.some((route) =>
      originalRequest.url?.includes(route),
    );

    // 2️⃣ إذا كان الخطأ 401 والمستخدم ليس في مسارات تسجيل الدخول، ولم تتم المحاولة مسبقاً
    if (
      error.response?.status === 401 &&
      !isAuthRoute &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true; // وضع علامة منع التكرار فوراً

      try {
        // 🔄 محاولة تجديد التوكن أونلاين
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/v1/user/refresh-token`,
          {},
          { withCredentials: true },
        );

        // 🎉 نجح التجديد! أعد تنفيذ طلب الصفحة الأصلي (مثال: user/me)
        return api(originalRequest);
      } catch (refreshError) {
        // ❌ فشل التجديد تماماً أونلاين (الـ Refresh Token منتهي أو غير موجود)
        console.error("فشل تجديد الجلسة، جاري التوجيه لتسجيل الدخول...");

        // مسح بيانات Zustand المحلية لتجنب التعليق
        localStorage.removeItem("auth");

        // توجيه صارم لصفحة الـ login
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    // 3️⃣ كسر الحلقة اللانهائية إذا كان الخطأ 401 يحدث داخل طلب الـ refresh نفسه
    if (
      error.response?.status === 401 &&
      originalRequest.url?.includes("user/refresh-token")
    ) {
      localStorage.removeItem("auth");
      window.location.href = "/login";
    }

    return Promise.reject(new Error(message));
  },
);

export default api;
