// frontend/src/pages/OrderDetails.jsx

import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useOrderStore from "@/store/orderStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getOrderStatusMap } from "@/utils/orderStatus";
import { Loader2, ArrowLeft } from "lucide-react";
function OrderDetails() {
  const { t } = useTranslation();
  const { id } = useParams();
  const { currentOrder, isLoading, fetchOrderById, cancelOrder } =
    useOrderStore();

  // ✅ خريطة الحالات هون جوا الكومبوننت (مش خارجه) عشان نقدر نستخدم t() جواها
  const statusMap = getOrderStatusMap(t);

  useEffect(() => {
    fetchOrderById(id);
  }, [id, fetchOrderById]);

  const handleCancel = async () => {
    if (!confirm(t("confirm_cancel_order"))) return;
    try {
      await cancelOrder(id);
      fetchOrderById(id);
    } catch (error) {
      alert(error.message);
    }
  };

  if (isLoading || !currentOrder) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 container mx-auto px-4 pt-24 pb-12 text-center text-muted-foreground animate-in fade-in duration-200">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
        <p className="text-sm font-medium">{t("loading")}</p>
      </div>
    );
  }

  const order = currentOrder;
  const status = statusMap[order.orderStatus] || {
    label: order.orderStatus,
    variant: "outline",
  };
  const canCancel = !["shipped", "delivered", "cancelled"].includes(
    order.orderStatus,
  );

  return (
    <div className="container mx-auto max-w-5xl px-4 pt-24 pb-12 mt-12 text-start text-foreground animate-in fade-in duration-300">
      {/* الهيدر العلوي ويحتوي العنوان وحالة الطلب الحالية */}
      <div className="mb-6 flex items-center justify-between gap-4 border-b border-border/60 pb-3">
        <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
          {t("order_details_title")}
        </h1>
        <Badge
          variant={status.variant}
          className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider"
        >
          {status.label}
        </Badge>
      </div>

      <div className="grid gap-8 md:grid-cols-3 items-start">
        {/* ─── المنتجات وعناوين الشحن التابعة للطلب ─────────────────── */}
        <div className="space-y-5 md:col-span-2">
          {/* قائمة منتجات الفاتورة */}
          <div className="space-y-3">
            {order.items.map((item) => (
              <div
                key={item.product}
                className="flex gap-4 rounded-xl border border-border/60 p-4 bg-card/70 backdrop-blur-sm shadow-sm transition-all hover:shadow-md hover:border-border/100 group"
              >
                <div className="shrink-0 relative overflow-hidden rounded-lg border border-border/50 bg-muted h-16 w-16">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <p className="font-bold text-sm sm:text-base leading-tight text-foreground">
                      {item.name}
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {t("quantity_label")}:{" "}
                      <span className="font-mono font-bold text-foreground">
                        {item.quantity}
                      </span>
                    </p>
                  </div>
                  <span className="font-extrabold text-sm sm:text-base text-primary font-mono whitespace-nowrap">
                    {item.price * item.quantity} {t("currency_symbol")}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* تفاصيل عنوان التوصيل والشحن */}
          <div className="rounded-xl border border-border/60 p-5 bg-card/40 backdrop-blur-sm shadow-sm space-y-2">
            <h2 className="text-sm sm:text-base font-extrabold tracking-tight text-foreground/90">
              {t("shipping_address")}
            </h2>
            <div className="space-y-1 text-xs sm:text-sm text-muted-foreground/90 leading-relaxed">
              <p className="font-semibold text-foreground/80">
                {order.shippingAddress.fullName}{" "}
                <span className="mx-1 text-border/80">|</span>{" "}
                <span className="font-mono">{order.shippingAddress.phone}</span>
              </p>
              <p>
                {order.shippingAddress.city}، {order.shippingAddress.street}
              </p>
              {order.shippingAddress.notes && (
                <p className="mt-2 text-xs bg-muted/60 text-muted-foreground p-2 rounded-lg border border-border/40 italic">
                  <span className="font-bold not-italic text-foreground/70">
                    {t("notes_label")}:
                  </span>{" "}
                  {order.shippingAddress.notes}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ─── كارت الحساب والملخص المالي الجانبي ─────────────────── */}
        <div className="h-fit rounded-xl border border-border/60 p-5 bg-card/70 backdrop-blur-sm shadow-xl md:sticky md:top-28 space-y-4">
          {/* المجموع الكلي */}
          <div className="flex justify-between items-center text-base sm:text-lg font-extrabold text-foreground border-b border-border/50 pb-3">
            <span>{t("total")}</span>
            <span className="text-primary font-mono tracking-tight">
              {order.totalPrice} {t("currency_symbol")}
            </span>
          </div>

          {/* تفاصيل الدفع والحالة */}
          <div className="space-y-2.5 border-b border-border/50 pb-4 text-xs sm:text-sm">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground/90 font-medium">
                {t("payment_method")}
              </span>
              <span className="font-bold text-foreground/90">
                {order.paymentMethod === "cod"
                  ? t("cash_on_delivery")
                  : t("online_payment")}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-muted-foreground/90 font-medium">
                {t("payment_status")}
              </span>
              <span
                className={`font-bold px-2 py-0.5 rounded-md text-[11px] ${order.paymentStatus === "paid" ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"}`}
              >
                {order.paymentStatus === "paid" ? t("paid") : t("unpaid")}
              </span>
            </div>
          </div>

          {/* زر إلغاء الطلب الديناميكي */}
          {canCancel && (
            <Button
              onClick={handleCancel}
              variant="destructive"
              className="w-full h-10 font-bold rounded-xl cursor-pointer transition-all shadow-sm flex items-center justify-center gap-2"
            >
              {t("cancel_order")}
            </Button>
          )}
        </div>
      </div>

      {/* رابط العودة لقائمة الطلبات السابقة */}
      <Link
        to="/orders"
        className="mt-6 inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-primary hover:text-primary/80 transition-colors group"
      >
        <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1 rtl:group-hover:translate-x-1" />
        {t("back_to_orders")}
      </Link>
    </div>
  );
}

export default OrderDetails;
