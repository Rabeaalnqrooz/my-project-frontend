// frontend/src/components/AdminRoute.jsx

import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "@/store/authStore";

// ============================================================
// 🔒 ADMIN ROUTE GUARD
// ============================================================

function AdminRoute() {
  const { user, isAuthChecked } = useAuthStore();

  // ✅ نفس منطق ProtectedRoute — ننتظر التحقق المركزي بدل ما نكرر getMe() هون
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

  // ⚠️ الترتيب مهم: أول نتحقق "مسجل دخول؟" وبعدين "أدمن فعلاً؟"
  // (بدل ما نفترض إنه أي user موجود لازم نتحقق دوره)
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/" replace />;

  return <Outlet />;
}

export default AdminRoute;
