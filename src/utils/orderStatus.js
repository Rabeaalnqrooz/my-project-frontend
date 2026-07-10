// frontend/src/utils/orderStatus.js

// ✅ دالة بترجع خريطة الحالات، بتاخد t كباراميتر عشان تقدر تترجم
// (الصفحات العامة بتستخدمها مع t، صفحات الأدمن الداخلية ممكن تستخدمها بدون ترجمة لو حبيت)
export const getOrderStatusMap = (t) => ({
  pending: {
    label: t ? t("status_pending") : "بانتظار التأكيد",
    variant: "secondary",
  },
  confirmed: {
    label: t ? t("status_confirmed") : "تم التأكيد",
    variant: "default",
  },
  shipped: { label: t ? t("status_shipped") : "تم الشحن", variant: "default" },
  delivered: {
    label: t ? t("status_delivered") : "تم التسليم",
    variant: "default",
  },
  cancelled: {
    label: t ? t("status_cancelled") : "ملغي",
    variant: "destructive",
  },
});

// ✅ الحالات المنطقية التالية المسموحة من كل حالة (مستخدمة بـ AdminOrders)
export const nextStatusOptions = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};
