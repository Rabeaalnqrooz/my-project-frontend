// frontend/src/components/ProtectedRoute.jsx

import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "@/store/authStore";

function ProtectedRoute() {
  const { user, isAuthChecked } = useAuthStore();

  // ✅ لسا ما تحقق التطبيق من الجلسة مع السيرفر — ننتظر بدل ما نتسرع بقرار خاطئ
  if (!isAuthChecked) {
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

  // ✅ التحقق خلص فعلياً، هلق نقرر بثقة
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
