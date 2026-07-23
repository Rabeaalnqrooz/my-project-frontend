// frontend/src/pages/ProductDetails.jsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useProductStore from "@/store/productStore";
import useCartStore from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import useAuthStore from "@/store/authStore";
import { Minus, Plus, ShoppingBag, Check, MessageCircle } from "lucide-react";

function ProductDetails() {
  const { t } = useTranslation();
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { currentProduct, isLoading, fetchProductBySlug, clearCurrentProduct } =
    useProductStore();
  const { addToCart, isLoading: cartLoading } = useCartStore();

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addSuccess, setAddSuccess] = useState(false);

  // 📱 قم بتغيير الرقم هنا لرقم هاتفك مع رمز الدولة بدون (+) أو أصفار دولية
  const WHATSAPP_PHONE_NUMBER = "962796150027";

  useEffect(() => {
    fetchProductBySlug(slug);
    return () => clearCurrentProduct();
  }, [slug, fetchProductBySlug, clearCurrentProduct]);

  useEffect(() => {
    setSelectedImage(0);
    setQuantity(1);
  }, [currentProduct?._id]);

  if (isLoading || !currentProduct) {
    return (
      <div className="container mx-auto px-4 pt-24 pb-12 text-center text-muted-foreground">
        {t("loading")}
      </div>
    );
  }

  const product = currentProduct;
  const hasDiscount = !!product.discountPrice;
  const finalPrice = hasDiscount ? product.discountPrice : product.price;
  const outOfStock = product.stock === 0;

  const increaseQty = () => {
    if (quantity < product.stock) setQuantity((q) => q + 1);
  };

  const decreaseQty = () => {
    if (quantity > 1) setQuantity((q) => q - 1);
  };

  const handleAddToCart = async () => {
    if (!user) {
      const goToLogin = window.confirm(t("login_required_alert"));
      if (goToLogin) {
        navigate("/login");
      }
      return;
    }
    try {
      await addToCart(product._id, quantity);
      setAddSuccess(true);
      setTimeout(() => setAddSuccess(false), 2000);
    } catch (error) {
      alert(error.message);
    }
  };

  // 📲 دالة فتح الواتساب برابط ورسالة ديناميكية مترجمة
  // 📲 دالة فتح الواتساب (بدون رابط)
  const handleWhatsAppOrder = () => {
    const message =
      `${t("whatsapp_message_prefix")}\n` +
      `- *${t("whatsapp_product_label")}:* ${product.name}\n` +
      `- *${t("whatsapp_quantity_label")}:* ${quantity}\n` +
      `- *${t("whatsapp_total_label")}:* ${finalPrice * quantity} ${t("currency_symbol")}`;

    const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="container mx-auto px-4 pt-24 pb-12 transition-colors duration-300">
      <div className="grid gap-8 md:grid-cols-2 lg:gap-12 items-start">
        {/* القسم الأيسر: معرض الصور */}
        <div className="flex flex-col gap-4">
          {/* الصورة الرئيسية */}
          <div className="aspect-square overflow-hidden rounded-2xl bg-muted/40 border border-border/50 shadow-sm relative group">
            <img
              src={product.images[selectedImage]?.url}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          {/* الصور المصغرة */}
          {product.images.length > 1 && (
            <div className="flex flex-wrap gap-2.5">
              {product.images.map((img, index) => (
                <button
                  key={img.publicId}
                  onClick={() => setSelectedImage(index)}
                  className={`h-16 w-16 overflow-hidden rounded-xl border-2 transition-all duration-200 cursor-pointer hover:opacity-90 ${
                    selectedImage === index
                      ? "border-primary shadow-sm scale-95"
                      : "border-border/60 bg-muted/20"
                  }`}
                >
                  <img
                    src={img.url}
                    alt={`${product.name} ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* القسم الأيمن: تفاصيل المنتج وعمليات الشراء */}
        <div className="flex flex-col text-start">
          {product.brand && (
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {product.brand}
            </p>
          )}

          <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            {product.name}
          </h1>

          {product.category?.name && (
            <div className="mt-2.5">
              <Badge
                variant="secondary"
                className="px-2.5 py-0.5 rounded-lg font-medium text-xs"
              >
                {product.category.name}
              </Badge>
            </div>
          )}

          {/* السعر والخصومات */}
          <div className="mt-5 flex items-center gap-3.5">
            <span className="text-3xl font-black text-primary tracking-tight">
              {finalPrice} {t("currency_symbol")}
            </span>
            {hasDiscount && (
              <div className="flex items-center gap-2">
                <span className="text-base text-muted-foreground line-through font-medium">
                  {product.price} {t("currency_symbol")}
                </span>
                <Badge
                  variant="destructive"
                  className="bg-destructive text-destructive-foreground font-bold px-2 py-0.5 rounded-md animate-pulse"
                >
                  {t("discount_percent", {
                    percent: product.discountPercentage,
                  })}
                </Badge>
              </div>
            )}
          </div>

          {/* حالة المخزون */}
          <div className="mt-3 text-sm font-semibold">
            {outOfStock ? (
              <span className="text-destructive flex items-center gap-1.5">
                ⚠️ {t("out_of_stock_full")}
              </span>
            ) : product.stock <= 5 ? (
              <span className="text-amber-500 dark:text-amber-400 flex items-center gap-1.5">
                🔥 {t("low_stock", { count: product.stock })}
              </span>
            ) : (
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                ✓ {t("in_stock")}
              </span>
            )}
          </div>

          {/* وصف المنتج */}
          <p className="mt-5 whitespace-pre-line text-muted-foreground text-sm leading-relaxed border-t border-border/40 pt-5">
            {product.description}
          </p>

          {/* لوحة التحكم بالشراء والطلب */}
          {!outOfStock && (
            <div className="mt-8 flex flex-col gap-4 border-t border-border/40 pt-6">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* التحكم بالكمية */}
                <div className="flex items-center justify-between rounded-xl border border-border/80 bg-card p-1 shadow-sm shrink-0 min-w-[130px]">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={decreaseQty}
                    className="h-9 w-9 rounded-lg hover:bg-muted cursor-pointer"
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-10 text-center font-bold text-sm text-foreground">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={increaseQty}
                    className="h-9 w-9 rounded-lg hover:bg-muted cursor-pointer"
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* زر إضافة إلى السلة */}
                <Button
                  onClick={handleAddToCart}
                  disabled={cartLoading}
                  className={`h-11 rounded-xl font-bold text-sm shadow-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer flex-1 ${
                    addSuccess
                      ? "bg-emerald-600 text-white hover:bg-emerald-600/90"
                      : "bg-primary text-primary-foreground hover:bg-primary/95"
                  }`}
                >
                  {addSuccess ? (
                    <>
                      <Check className="h-4 w-4 animate-scale-in" />
                      {t("added_to_cart")}
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="h-4 w-4" />
                      {t("add_to_cart")}
                    </>
                  )}
                </Button>
              </div>

              {/* 🟢 زر الطلب عبر الواتساب */}
              <Button
                onClick={handleWhatsAppOrder}
                variant="outline"
                className="h-11 rounded-xl font-bold text-sm shadow-sm border-emerald-500 text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/30 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer w-full"
              >
                <MessageCircle className="h-5 w-5 fill-emerald-500/20 text-emerald-600 dark:text-emerald-400" />
                {t("order_via_whatsapp")}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
