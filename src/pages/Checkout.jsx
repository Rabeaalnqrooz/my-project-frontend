// frontend/src/pages/Checkout.jsx

import { useState, useEffect } from "react"; // 1. أضفنا useEffect هنا
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useCartStore from "@/store/cartStore";
import useOrderStore from "@/store/orderStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
function Checkout() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { cart, getTotalPrice, fetchCart } = useCartStore();
  const { createOrder, isLoading } = useOrderStore();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    city: "",
    street: "",
    notes: "",
  });

  const [submitError, setSubmitError] = useState("");

  // 2. نقوم بالتوجيه بشكل آمن هنا فقط عند حدوث تغيير وطالما المكون جاهز
  useEffect(() => {
    if (cart.items.length === 0) {
      navigate("/cart");
    }
  }, [cart.items.length, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      // 1. إزالة أي رمز أو حرف ليس رقماً
      const onlyNums = value.replace(/\D/g, "");

      // 2. منع كتابة أكثر من 10 أرقام
      if (onlyNums.length > 10) return;

      setFormData({ ...formData, [name]: onlyNums });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    // التعبير النمطي: يجب أن يبدأ بـ 077 أو 078 أو 079 ويتبعه 7 أرقام أخرى (المجموع 10 أرقام)
    const jordanPhoneRegex = /^07[789]\d{7}$/;

    if (!jordanPhoneRegex.test(formData.phone)) {
      // يمكنك ترجمة هذا النص باستخدام t("invalid_jordan_phone") إذا كنت تفضل ذلك
      setSubmitError(t("invalid_jordan_phone"));
      return;
    }

    try {
      const res = await createOrder({
        shippingAddress: formData,
        paymentMethod: "cod",
      });

      await fetchCart();
      navigate(`/orders/${res.order._id}`);
    } catch (error) {
      setSubmitError(error.message);
    }
  };
  // 3. منع المكون من إكمال الـ render للواجهة إذا كانت السلة فارغة تفادياً لأي أخطاء بقراءة البيانات
  if (cart.items.length === 0) {
    return null;
  }

  const totalPrice = getTotalPrice();

  return (
    <div className="container mx-auto max-w-5xl px-4 pt-24 pb-12 mt-12 text-start text-foreground animate-in fade-in duration-300">
      {/* عنوان الصفحة الرئيسي */}
      <h1 className="mb-6 text-xl sm:text-2xl font-extrabold tracking-tight border-b border-border/60 pb-3">
        {t("checkout_title")}
      </h1>

      <div className="grid gap-8 md:grid-cols-3 items-start">
        {/* ─── نموذج بيانات الشحن والتوصيل ─────────────────── */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5 md:col-span-2 bg-card/40 backdrop-blur-sm border border-border/60 p-5 sm:p-6 rounded-xl shadow-sm"
        >
          <div className="space-y-1">
            <Label
              htmlFor="fullName"
              className="text-xs sm:text-sm font-bold text-foreground/90"
            >
              {t("full_name")}
            </Label>
            <Input
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="h-10 bg-background/50 border-border/80 focus-visible:ring-primary rounded-lg transition-all"
            />
          </div>

          <div className="space-y-1">
            <Label
              htmlFor="phone"
              className="text-xs sm:text-sm font-bold text-foreground/90"
            >
              {t("phone_number")}
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              inputMode="numeric" // يفتح كيبورد الأرقام مباشرة في الموبايل
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="07XXXXXXXX"
              className="h-10 bg-background/50 border-border/80 focus-visible:ring-primary rounded-lg font-mono tracking-wide transition-all text-left rtl:text-right"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <Label
                htmlFor="city"
                className="text-xs sm:text-sm font-bold text-foreground/90"
              >
                {t("city")}
              </Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="h-10 bg-background/50 border-border/80 focus-visible:ring-primary rounded-lg transition-all"
              />
            </div>

            <div className="space-y-1">
              <Label
                htmlFor="street"
                className="text-xs sm:text-sm font-bold text-foreground/90"
              >
                {t("street_address")}
              </Label>
              <Input
                id="street"
                name="street"
                value={formData.street}
                onChange={handleChange}
                required
                className="h-10 bg-background/50 border-border/80 focus-visible:ring-primary rounded-lg transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label
              htmlFor="notes"
              className="text-xs sm:text-sm font-bold text-foreground/90"
            >
              {t("notes_optional")}
            </Label>
            <Input
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="h-10 bg-background/50 border-border/80 focus-visible:ring-primary rounded-lg transition-all"
            />
          </div>

          {/* طريقة الدفع */}
          <div className="space-y-2 pt-2">
            <Label className="text-xs sm:text-sm font-bold text-foreground/90">
              {t("payment_method")}
            </Label>
            <div className="flex items-start gap-3 rounded-xl border border-primary/30 bg-muted/50 p-4 shadow-inner transition-colors">
              <input
                type="radio"
                checked
                disabled
                className="mt-1 h-4 w-4 accent-primary cursor-not-allowed"
              />
              <div className="space-y-0.5">
                <p className="text-sm font-bold text-foreground">
                  {t("cash_on_delivery")}
                </p>
                <p className="text-xs text-muted-foreground/90 leading-relaxed">
                  {t("cash_on_delivery_desc")}
                </p>
              </div>
            </div>
          </div>

          {/* عرض أخطاء الإرسال إن وجدت */}
          {submitError && (
            <p className="text-xs sm:text-sm font-semibold text-destructive animate-shake">
              {submitError}
            </p>
          )}

          {/* زر تأكيد الطلب والدفع */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 bg-primary text-primary-foreground font-bold rounded-xl cursor-pointer shadow-sm hover:bg-primary/95 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-70"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin h-4 w-4" />
                {t("processing_order")}
              </>
            ) : (
              t("confirm_order")
            )}
          </Button>
        </form>

        {/* ─── كارت ملخص الطلب الجانبي ─────────────────── */}
        <div className="h-fit rounded-xl border border-border/60 p-5 bg-card/70 backdrop-blur-sm shadow-xl md:sticky md:top-28 space-y-4">
          <h2 className="font-extrabold text-base sm:text-lg tracking-tight border-b border-border/50 pb-2">
            {t("order_summary")}
          </h2>

          {/* قائمة المنتجات المصغرة داخل الفاتورة */}
          <div className="space-y-3 max-h-[240px] overflow-y-auto border-b border-border/50 pb-4 pr-1 text-xs sm:text-sm scrollbar-thin">
            {cart.items.map((item) => {
              const product = item.product;
              if (!product) return null;
              const price = product.discountPrice || product.price;
              return (
                <div
                  key={product._id}
                  className="flex justify-between items-start gap-4"
                >
                  <span className="text-muted-foreground/90 font-medium leading-tight">
                    {product.name}{" "}
                    <span className="font-mono font-bold text-foreground text-xs mx-1">
                      ×{item.quantity}
                    </span>
                  </span>
                  <span className="font-bold shrink-0 text-foreground/90 font-mono">
                    {price * item.quantity} {t("currency_symbol")}
                  </span>
                </div>
              );
            })}
          </div>

          {/* المجموع النهائي */}
          <div className="flex justify-between items-center text-base sm:text-lg font-extrabold text-foreground pt-1">
            <span>{t("total")}</span>
            <span className="text-primary font-mono tracking-tight">
              {totalPrice} {t("currency_symbol")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
