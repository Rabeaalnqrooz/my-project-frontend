// frontend/src/pages/MyOrders.jsx

import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useOrderStore from "@/store/orderStore";
import { Badge } from "@/components/ui/badge";
import { getOrderStatusMap } from "@/utils/orderStatus";
import { Loader2, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
function MyOrders() {
  const { t, i18n } = useTranslation();
  const { orders, isLoading, fetchMyOrders } = useOrderStore();
  const statusMap = getOrderStatusMap(t);

  useEffect(() => {
    fetchMyOrders();
  }, [fetchMyOrders]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 container mx-auto px-4 pt-24 pb-12 text-center text-muted-foreground animate-in fade-in duration-200">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
        <p className="text-sm font-medium">{t("loading")}</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-[70vh] container mx-auto flex flex-col items-center justify-center gap-5 px-4 pt-32 pb-12 text-center animate-in fade-in zoom-in-95 duration-200">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center text-muted-foreground shadow-inner">
          <Inbox className="h-8 w-8" />
        </div>
        <div className="space-y-1">
          <p className="text-lg font-bold text-foreground">
            {t("my_orders_empty")}
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xs mx-auto">
            {t("no_past_orders_desc") ||
              "لا توجد طلبات سابقة مسجلة في حسابك حالياً."}
          </p>
        </div>
        <Button
          asChild
          className="h-10 px-6 rounded-xl font-bold bg-primary text-primary-foreground shadow-sm hover:bg-primary/95 transition-all"
        >
          <Link to="/products">{t("browse_products")}</Link>
        </Button>
      </div>
    );
  }

  // ✅ نحدد لغة التاريخ حسب لغة الواجهة الحالية
  const dateLocale = i18n.language.startsWith("en") ? "en-GB" : "ar-JO";

  return (
    <div className="container mx-auto max-w-4xl px-4 pt-24 pb-12 mt-12 text-start text-foreground animate-in fade-in duration-300">
      {/* عنوان الصفحة الرئيسي */}
      <h1 className="mb-6 text-xl sm:text-2xl font-extrabold tracking-tight border-b border-border/60 pb-3">
        {t("my_orders_title")}
      </h1>

      {/* قائمة سجل الطلبات */}
      <div className="space-y-3">
        {orders.map((order) => {
          const status = statusMap[order.orderStatus] || {
            label: order.orderStatus,
            variant: "outline",
          };
          return (
            <Link
              key={order._id}
              to={`/orders/${order._id}`}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-border/60 p-4 bg-card/70 backdrop-blur-sm shadow-sm transition-all hover:bg-muted/40 hover:border-border/100 hover:scale-[1.01] group"
            >
              <div className="space-y-1">
                <p className="font-bold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors">
                  {t("order_number")}{" "}
                  <span className="font-mono bg-muted/80 text-foreground px-1.5 py-0.5 rounded text-xs border border-border/40 ml-1">
                    #{order._id.slice(-6).toUpperCase()}
                  </span>
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground/90 font-medium">
                  <span className="font-mono">
                    {new Date(order.createdAt).toLocaleDateString(dateLocale)}
                  </span>
                  <span className="mx-2 text-border">|</span>
                  <span>
                    {order.items.length} {t("product_unit")}
                  </span>
                </p>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 border-t border-border/40 pt-3 sm:border-0 sm:pt-0">
                <span className="font-extrabold text-sm sm:text-base text-primary font-mono">
                  {order.totalPrice} {t("currency_symbol")}
                </span>
                <Badge
                  variant={status.variant}
                  className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide shrink-0"
                >
                  {status.label}
                </Badge>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default MyOrders;
