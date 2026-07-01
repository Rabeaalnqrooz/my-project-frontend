import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "@/store/authStore";

function ProtectedRoute() {
  const { user } = useAuthStore();

  // ✅ Outlet يعرض الصفحة المطلوبة إذا المستخدم مسجل
  // Navigate يوجهه لـ Login إذا مش مسجل
  return user ? <Outlet /> : <Navigate to="/login" />;
}

export default ProtectedRoute;
