import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "@/store/authStore"; // عدل المسار حسب مشروعك

const ProtectedRoute = () => {
  const { user } = useAuthStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // ⏳ ننتظر حتى يقوم Zustand بقراءة الـ localStorage بالكامل أونلاين
    const checkHydration = async () => {
      await useAuthStore.persist.rehydrate();
      setIsReady(true);
    };
    checkHydration();
  }, []);

  // 1️⃣ ما دام Zustand لم ينتهِ من المزامنة أونلاين، لا تعرض الـ Loader الأصلي الذي يعلق، بل انتظر ثانية
  if (!isReady) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>جاري تحميل الجلسة الآمنة...</p>
      </div>
    );
  }

  // 2️⃣ الآن بعد أن أصبحت البيانات جاهزة ومقروءة تماماً من المتصفح:
  if (!user) {
    // إذا لم يجد مستخدم، يوجهه فوراً للـ login دون تعليق
    return <Navigate to="/login" replace />;
  }

  // إذا كان المستخدم موجوداً، يفتح الصفحة المحمية فوراً
  return <Outlet />;
};

export default ProtectedRoute;
