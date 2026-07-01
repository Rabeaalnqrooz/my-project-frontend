// src/components/AdminRoute.jsx

import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import useAuthStore from "@/store/authStore";

// ============================================================
// 🔒 ADMIN ROUTE GUARD
// ============================================================

function AdminRoute() {
  const { user, getMe } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const check = async () => {
      try {
        const res = await getMe();
        console.log("✅ getMe success:", res);
      } catch (error) {
        console.log("❌ getMe failed:", error.message);
      } finally {
        setIsChecking(false);
      }
    };
    check();
  }, []);

  // ✅ انتظر حتى نتحقق - تم ضبط الخلفية والسبينر ليدعم الـ Dark Mode تلقائياً
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background transition-colors duration-300">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // مش مسجل
  if (!user) return <Navigate to="/login" replace />;

  // مش أدمن
  if (user.role !== "admin") return <Navigate to="/" replace />;

  // ✅ أدمن
  return <Outlet />;
}

export default AdminRoute;
