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

  // ❌ الطلب فشل — محاولة التجديد التلقائي بالخلفية قبل اتخاذ قرار الطرد
  async (error) => {
    const originalRequest = error.config;
    const message =
      error.response?.data?.message || error.message || "حدث خطأ غير متوقع";

    // ✅ تحديث المسارات هنا لتطابق بادئة الـ Backend الجديدة
    const authRoutes = [
      "user/login",
      "user/register",
      "user/forgot-password",
      "user/refresh-token",
    ];

    const isAuthRoute = authRoutes.some((route) =>
      originalRequest.url?.includes(route),
    );

    // ✅ التجديد يتم فقط إذا كان الخطأ 401، وليس مسار Auth، ولم نقم بالمحاولة مسبقاً (_retry)
    if (
      error.response?.status === 401 &&
      !isAuthRoute &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true; // علامة لمنع الدخول في حلقة لانهائية إذا فشل التجديد

      try {
        // 🔄 استدعاء مسار التجديد مع تضمين الإصدار الجديد /api/v1/
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/v1/user/refresh-token`,
          {},
          { withCredentials: true },
        );

        // 🎉 نجح التجديد بنجاح! أعد تنفيذ طلب المستخدم الأصلي بنفس كلاس الـ api
        return api(originalRequest);
      } catch (refreshError) {
        // ❌ فشل التجديد (الـ Refresh Token منتهي الصلاحية أيضاً أو محذوف) -> هنا نطرد المستخدم للـ Login
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    // إرجاع الخطأ العادي في حال كانت المشكلة ليست 401 أو فشلت المحاولات
    return Promise.reject(new Error(message));
  },
);

export default api;
