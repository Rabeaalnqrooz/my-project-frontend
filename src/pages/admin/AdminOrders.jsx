// frontend/src/pages/admin/AdminOrders.jsx

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useOrderStore from "@/store/orderStore";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getOrderStatusMap } from "@/utils/orderStatus";
import { Loader2, Inbox } from "lucide-react";
const nextStatusOptions = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

function AdminOrders() {
  const { t, i18n } = useTranslation();
  const { orders, isLoading, fetchAllOrders, updateOrderStatus } =
    useOrderStore();
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState(null);

  const statusMap = getOrderStatusMap(t);
  const dateLocale = i18n.language.startsWith("en") ? "en-GB" : "ar-JO";

  useEffect(() => {
    fetchAllOrders(statusFilter === "all" ? undefined : statusFilter);
  }, [statusFilter, fetchAllOrders]);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
    } catch (error) {
      alert(error.message);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6 mt-12 text-start text-foreground animate-in fade-in duration-300">
      {/* الهيدر العلوي المطور مع فلتر الحالات */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/60 pb-4">
        <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
          {t("admin_orders_title")}
        </h1>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48 h-10 rounded-xl border-border/60 shadow-sm focus:ring-primary">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all" className="rounded-lg">
              {t("all_statuses")}
            </SelectItem>
            <SelectItem value="pending" className="rounded-lg">
              {t("status_pending")}
            </SelectItem>
            <SelectItem value="confirmed" className="rounded-lg">
              {t("status_confirmed")}
            </SelectItem>
            <SelectItem value="shipped" className="rounded-lg">
              {t("status_shipped")}
            </SelectItem>
            <SelectItem value="delivered" className="rounded-lg">
              {t("status_delivered")}
            </SelectItem>
            <SelectItem value="cancelled" className="rounded-lg">
              {t("status_cancelled")}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* ─── حالة جلب البيانات / عدم وجود طلبات ────────────────────────── */}
      {isLoading ? (
        <div className="min-h-[30vh] flex flex-col items-center justify-center gap-2 text-center text-muted-foreground py-12 animate-in fade-in duration-200">
          <Loader2 className="animate-spin h-8 w-8 text-primary" />
          <p className="text-xs font-medium">{t("loading")}</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="min-h-[25vh] flex flex-col items-center justify-center gap-3 text-center border border-dashed border-border rounded-xl p-8 bg-muted/10">
          <Inbox className="h-8 w-8 text-muted-foreground/60" />
          <p className="text-sm font-semibold text-muted-foreground">
            {t("no_matching_orders")}
          </p>
        </div>
      ) : (
        /* ─── جدول الطلبات الإداري المطور ───────────────────────────── */
        <div className="overflow-x-auto rounded-xl border border-border/60 bg-card/20 backdrop-blur-sm shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-muted/60 text-muted-foreground/90 font-bold border-b border-border/60">
              <tr>
                <th className="p-3.5 text-start font-bold whitespace-nowrap">
                  {t("table_order_number")}
                </th>
                <th className="p-3.5 text-start font-bold whitespace-nowrap">
                  {t("table_customer")}
                </th>
                <th className="p-3.5 text-start font-bold whitespace-nowrap">
                  {t("table_total")}
                </th>
                <th className="p-3.5 text-start font-bold whitespace-nowrap">
                  {t("table_payment")}
                </th>
                <th className="p-3.5 text-start font-bold whitespace-nowrap">
                  {t("table_status")}
                </th>
                <th className="p-3.5 text-start font-bold whitespace-nowrap">
                  {t("table_change_status")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {orders.map((order) => {
                const status = statusMap[order.orderStatus];
                const availableNext = nextStatusOptions[order.orderStatus];
                const isCurrentOrderUpdating = updatingId === order._id;

                return (
                  <tr
                    key={order._id}
                    className="transition-colors hover:bg-muted/30 group"
                  >
                    {/* رقم الطلب والتاريخ */}
                    <td className="p-3.5">
                      <Link
                        to={`/orders/${order._id}`}
                        className="font-mono font-bold text-primary hover:underline block"
                      >
                        #{order._id.slice(-6).toUpperCase()}
                      </Link>
                      <span className="text-[11px] font-medium text-muted-foreground/80 block mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString(
                          dateLocale,
                        )}
                      </span>
                    </td>

                    {/* اسم العميل */}
                    <td className="p-3.5 font-semibold text-foreground">
                      {order.user?.firstName} {order.user?.lastName}
                    </td>

                    {/* الإجمالي */}
                    <td className="p-3.5 font-extrabold text-foreground font-mono">
                      {order.totalPrice}{" "}
                      <span className="text-xs font-semibold text-muted-foreground/80 font-sans">
                        {t("currency_symbol")}
                      </span>
                    </td>

                    {/* طريقة الدفع */}
                    <td className="p-3.5 text-xs font-medium text-muted-foreground">
                      {order.paymentMethod === "cod" ? (
                        <span className="bg-muted px-2 py-1 rounded-md border border-border/40">
                          {t("cash_on_delivery")}
                        </span>
                      ) : (
                        <span className="bg-primary/5 text-primary px-2 py-1 rounded-md border border-primary/10">
                          {t("online_payment")}
                        </span>
                      )}
                    </td>

                    {/* حالة الطلب الحالية */}
                    <td className="p-3.5">
                      <Badge
                        variant={status.variant}
                        className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide shadow-sm"
                      >
                        {status.label}
                      </Badge>
                    </td>

                    {/* تغيير حالة الطلب */}
                    <td className="p-3.5">
                      {availableNext.length > 0 ? (
                        <Select
                          value=""
                          onValueChange={(value) =>
                            handleStatusChange(order._id, value)
                          }
                          disabled={isCurrentOrderUpdating}
                        >
                          <SelectTrigger className="w-40 h-8 text-xs font-medium rounded-lg border-border/60 shadow-sm">
                            <SelectValue
                              placeholder={
                                isCurrentOrderUpdating ? (
                                  <span className="flex items-center gap-1">
                                    <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                                    {t("updating_placeholder")}
                                  </span>
                                ) : (
                                  t("change_status_placeholder")
                                )
                              }
                            />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            {availableNext.map((s) => (
                              <SelectItem
                                key={s}
                                value={s}
                                className="rounded-lg text-xs"
                              >
                                {statusMap[s].label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <span className="text-xs font-medium text-muted-foreground/60 italic pl-1">
                          {t("no_action_available")}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminOrders;
