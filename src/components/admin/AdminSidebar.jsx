import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Menu,
  LayoutDashboard,
  Package,
  Tags,
  ShoppingBag,
  Users,
} from "lucide-react";
import { Button } from "../ui/button";

function AdminSidebar({ isCollapsed, onToggle }) {
  const { t } = useTranslation();

  const navItems = [
    { to: "/admin", label: t("home"), icon: LayoutDashboard, end: true },
    { to: "/admin/products", label: t("products"), icon: Package },
    { to: "/admin/categories", label: t("categories_label"), icon: Tags },
    { to: "/admin/orders", label: t("orders_label"), icon: ShoppingBag },
    { to: "/admin/users", label: t("users_label"), icon: Users },
  ];

  return (
    // يتغير العرض (w-56 أو w-16) بناءً على حالة الانضباب مع تأثير حركة ناعم جداً duration-300
    <aside
      className={`shrink-0 border-e border-border/60 bg-card/50 backdrop-blur-sm p-3 flex flex-col h-full select-none transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-56"
      }`}
    >
      {/* الهيدر الداخلي: يحتوي على زر الـ Menu للتحكم والعنوان */}
      <div
        className={`flex items-center mb-5 ${isCollapsed ? "justify-center" : "justify-between px-1"}`}
      >
        {!isCollapsed && (
          <h2 className="text-sm font-bold tracking-wider text-muted-foreground/70 uppercase truncate animate-in fade-in duration-200">
            {t("admin_dashboard_title") || "Dashboard"}
          </h2>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="h-9 w-9 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground shrink-0 cursor-pointer"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      {/* الروابط الملاحية */}
      <nav className="space-y-1.5 flex-1">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            title={isCollapsed ? label : ""} // يظهر اسم الصفحة عند تمرير الماوس إذا كان منضباً
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 text-sm font-semibold transition-all duration-200 rounded-xl active:scale-[0.98] group ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20 font-bold"
                  : "text-muted-foreground/90 hover:bg-muted/60 hover:text-foreground"
              } ${isCollapsed ? "justify-center px-0 h-10 w-10 mx-auto" : ""}`
            }
          >
            <Icon className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-105" />

            {/* إخفاء النص بحركة ناعمة عندما ينضب السايدبار */}
            {!isCollapsed && (
              <span className="truncate animate-in fade-in duration-200">
                {label}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default AdminSidebar;
