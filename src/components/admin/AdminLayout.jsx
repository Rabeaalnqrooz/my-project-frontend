import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";

function AdminLayout() {
  // حالة التحكم: هل السايدبار منضب أم مفتوح؟
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground transition-colors duration-300 animate-in fade-in duration-500 pt-16">
      {/* السايدبار ونمرر له حالة الانضباب ودالة التبديل */}
      <div className="h-[calc(100vh-4rem)] sticky top-16 z-40 flex flex-col shrink-0 transition-all duration-300">
        <AdminSidebar
          isCollapsed={isCollapsed}
          onToggle={() => setIsCollapsed(!isCollapsed)}
        />
      </div>

      {/* منطقة عرض محتوى الصفحات */}
      <main className="flex-1 w-full overflow-x-auto p-6 space-y-6">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
