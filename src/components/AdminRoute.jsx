// frontend/src/components/AdminRoute.jsx

import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-dom";
import useAuthStore from "@/store/authStore";

// ============================================================
// 🔒 ADMIN ROUTE GUARD (المطور للأونلاين)
// ============================================================

function AdminRoute() {
  const { user } = useAuthStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // ⏳ نضمن إعادة مزامنة الجلسة من الـ localStorage بالكامل قبل اتخاذ أي قرار
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

  // ✅ 1️⃣ ننتظر حتى تكتمل جاهزية الجلسة أونلاين تماماً
  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background/80 backdrop-blur-[2px] transition-colors duration-300 animate-in fade-in duration-500">
        <div className="relative flex items-center justify-center">
          {/* الدائرة الخلفية الناعمة */}
          <div className="h-10 w-10 rounded-full border-4 border-muted" />
          {/* الجزء المتحرك الذكي */}
          <div className="absolute h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent border-r-transparent" />
        </div>
      </div>
    );
  }

  // ✅ 2️⃣ الترتيب الآمن والصارم بعد جاهزية البيانات
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
