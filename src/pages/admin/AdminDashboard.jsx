// frontend/src/pages/admin/AdminDashboard.jsx

import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  DollarSign,
  ShoppingBag,
  Package,
  Clock,
  Loader2,
  ClipboardList,
} from "lucide-react";
import useDashboardStore from "@/store/dashboardStore";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getOrderStatusMap } from "@/utils/orderStatus";

// ✅ كارت إحصائية قابل لإعادة الاستخدام لكل مؤشر
function StatCard({ icon: Icon, label, value, highlight }) {
  return (
    <Card className="flex flex-col items-center justify-center text-center gap-3 p-5 bg-card/60 backdrop-blur-sm border-border/60 rounded-xl shadow-sm transition-all duration-200 hover:shadow-md hover:border-border/100 group">
      {/* حاوية الأيقونة التفاعلية - أصبحت ممركزة في الأعلى */}
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-inner transition-transform group-hover:scale-105 ${
          highlight
            ? "bg-primary/10 text-primary border border-primary/20"
            : "bg-muted text-muted-foreground/90 border border-border/40"
        }`}
      >
        <Icon className="h-5 w-5" />
      </div>

      {/* النصوص والأرقام ممركزة تماماً بالمنتصف */}
      <div className="space-y-0.5 w-full overflow-hidden">
        <p className="text-xs sm:text-sm font-semibold text-muted-foreground/80 truncate">
          {label}
        </p>
        <p className="text-lg sm:text-xl font-extrabold text-foreground tracking-tight font-mono">
          {value}
        </p>
      </div>
    </Card>
  );
}

function AdminDashboard() {
  const { t, i18n } = useTranslation();
  const { stats, isLoading, fetchStats } = useDashboardStore();

  const statusMap = getOrderStatusMap(t);
  const dateLocale = i18n.language.startsWith("en") ? "en-GB" : "ar-JO";

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (isLoading || !stats) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3 text-center text-muted-foreground animate-in fade-in duration-200">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
        <p className="text-sm font-medium">{t("loading")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 mt-12 text-start text-foreground animate-in fade-in duration-300">
      {/* عنوان لوحة التحكم الأساسي */}
      <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight border-b border-border/60 pb-3">
        {t("admin_dashboard_title")}
      </h1>

      {/* ─── شبكة بطاقات المؤشرات والإحصائيات ─────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={DollarSign}
          label={t("stat_total_revenue")}
          value={`${stats.totalRevenue} ${t("currency_symbol")}`}
          highlight
        />
        <StatCard
          icon={Clock}
          label={t("stat_pending_orders")}
          value={stats.pendingOrdersCount}
        />
        <StatCard
          icon={ShoppingBag}
          label={t("stat_total_orders")}
          value={stats.totalOrders}
        />
        <StatCard
          icon={Package}
          label={t("stat_active_products")}
          value={stats.totalProducts}
        />
      </div>

      {/* ─── قسم آخر الطلبات الواردة ─────────────────── */}
      <div className="space-y-4">
        <h2 className="text-base sm:text-lg font-extrabold tracking-tight text-foreground/90">
          {t("recent_orders_title")}
        </h2>

        {stats.recentOrders.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border/80 p-8 text-center bg-card/20 backdrop-blur-sm space-y-2 animate-in fade-in duration-200">
            <ClipboardList className="h-8 w-8 text-muted-foreground/60 mx-auto" />
            <p className="text-sm font-medium text-muted-foreground">
              {t("no_orders_yet")}
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {stats.recentOrders.map((order) => {
              const status = statusMap[order.orderStatus] || {
                label: order.orderStatus,
                variant: "outline",
              };
              return (
                <Link
                  key={order._id}
                  to={`/orders/${order._id}`}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-border/60 p-4 bg-card/40 backdrop-blur-sm shadow-sm transition-all hover:bg-muted/40 hover:border-border/100 hover:scale-[1.005] group"
                >
                  <div className="space-y-1">
                    <p className="font-bold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors">
                      <span className="font-mono bg-muted text-foreground/90 px-1.5 py-0.5 rounded text-xs border border-border/40 mr-1.5 ltr:mr-1.5 rtl:ml-1.5">
                        #{order._id.slice(-6).toUpperCase()}
                      </span>
                      <span className="font-semibold text-foreground/80">
                        {order.user?.firstName} {order.user?.lastName}
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground/90 font-medium font-mono">
                      {new Date(order.createdAt).toLocaleDateString(dateLocale)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 border-t border-border/40 pt-2.5 sm:border-0 sm:pt-0">
                    <span className="font-extrabold text-sm sm:text-base text-primary font-mono whitespace-nowrap">
                      {order.totalPrice} {t("currency_symbol")}
                    </span>
                    <Badge
                      variant={status.variant}
                      className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide shrink-0 uppercase"
                    >
                      {status.label}
                    </Badge>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
