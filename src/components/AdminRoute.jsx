// frontend/src/components/AdminRoute.jsx

import { useEffect, useState } from "react";
// ✅ التصحيح: استيراد المكونات من مكتبة الراوتر وليس react-dom
import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "@/store/authStore";

// ============================================================
// 🔒 ADMIN ROUTE GUARD (المطور للأونلاين)
// ============================================================

function AdminRoute() {
  const { user } = useAuthStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const syncAuth = async () => {
      try {
        await useAuthStore.persist.rehydrate();
      } catch (err) {
        console.error("خطأ أثناء مزامنة جلسة الأدمن:", err);
      } finally {
        setIsReady(true);
      }
    };
    syncAuth();
  }, []);

  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background/80 backdrop-blur-[2px]">
        <div className="relative flex items-center justify-center">
          <div className="h-10 w-10 rounded-full border-4 border-muted" />
          <div className="absolute h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent border-r-transparent" />
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    console.warn("محاولة دخول غير مصرحة، المستخدم ليس مسؤولاً!");
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default AdminRoute;
