// frontend/src/pages/Cart.jsx

import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useCartStore from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import { Loader2, ShoppingBag } from "lucide-react";

function Cart() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    cart,
    isLoading,
    fetchCart,
    updateQuantity,
    removeItem,
    getTotalPrice,
  } = useCartStore();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleQuantityChange = async (productId, newQuantity, maxStock) => {
    if (newQuantity < 1 || newQuantity > maxStock) return;
    try {
      await updateQuantity(productId, newQuantity);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeItem(productId);
    } catch (error) {
      alert(error.message);
    }
  };

  if (isLoading && cart.items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 container mx-auto px-4 pt-24 pb-12 text-center text-muted-foreground animate-in fade-in duration-200">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
        <p className="text-sm font-medium">{t("loading")}</p>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="min-h-[70vh] container mx-auto flex flex-col items-center justify-center gap-5 px-4 pt-32 pb-12 text-center animate-in fade-in zoom-in-95 duration-200">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center text-muted-foreground shadow-inner">
          <ShoppingBag className="h-8 w-8" />
        </div>
        <div className="space-y-1">
          <p className="text-lg font-bold text-foreground">
            {t("empty_cart_message")}
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

  const totalPrice = getTotalPrice();

  return (
    <div className="container mx-auto max-w-5xl px-4 pt-24 pb-12 mt-12 text-start text-foreground animate-in fade-in duration-300">
      <h1 className="mb-6 text-xl sm:text-2xl font-extrabold tracking-tight border-b border-border/60 pb-3">
        {t("cart_title")}
      </h1>

      <div className="grid gap-8 md:grid-cols-3 items-start">
        {/* ─── قائمة منتجات السلة ─────────────────── */}
        <div className="space-y-4 md:col-span-2">
          {cart.items.map((item) => {
            const product = item.product;
            if (!product) return null;

            const price = product.discountPrice || product.price;

            return (
              <div
                key={product._id}
                className="flex gap-4 rounded-xl border border-border/60 p-4 bg-card/70 backdrop-blur-sm shadow-sm transition-all hover:shadow-md hover:border-border/100 group"
              >
                <Link
                  to={`/products/${product.slug}`}
                  className="shrink-0 relative overflow-hidden rounded-lg border border-border/50 bg-muted"
                >
                  <img
                    src={product.images?.[0]?.url}
                    alt={product.name}
                    className="h-20 w-20 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </Link>

                <div className="flex flex-1 flex-col justify-between space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <Link
                      to={`/products/${product.slug}`}
                      className="font-bold text-sm sm:text-base hover:text-primary transition-colors leading-snug"
                    >
                      {product.name}
                    </Link>
                    <button
                      onClick={() => handleRemove(product._id)}
                      className="cursor-pointer text-xs sm:text-sm font-semibold text-destructive hover:underline shrink-0 transition-all"
                    >
                      {t("remove")}
                    </button>
                  </div>

                  {!product.isActive && (
                    <p className="text-xs font-semibold text-destructive animate-pulse">
                      {t("product_unavailable")}
                    </p>
                  )}

                  <div className="flex items-center justify-between flex-wrap gap-3 pt-1">
                    {/* أداة التحكم بالكمية المحدثة */}
                    <div className="flex items-center rounded-lg border border-border/80 bg-muted/40 h-8 overflow-hidden shadow-inner">
                      <button
                        onClick={() =>
                          handleQuantityChange(
                            product._id,
                            item.quantity - 1,
                            product.stock,
                          )
                        }
                        className="cursor-pointer px-2.5 h-full hover:bg-muted text-muted-foreground hover:text-foreground font-bold transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                        disabled={item.quantity <= 1}
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-xs font-mono font-bold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleQuantityChange(
                            product._id,
                            item.quantity + 1,
                            product.stock,
                          )
                        }
                        className="cursor-pointer px-2.5 h-full hover:bg-muted text-muted-foreground hover:text-foreground font-bold transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                        disabled={item.quantity >= product.stock}
                      >
                        +
                      </button>
                    </div>

                    {/* السعر الإجمالي للمنتج */}
                    <span className="font-extrabold text-sm sm:text-base text-primary">
                      {price * item.quantity} {t("currency_symbol")}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ─── ملخص الطلب ─────────────────── */}
        <div className="h-fit rounded-xl border border-border/60 p-5 bg-card/70 backdrop-blur-sm shadow-xl sticky top-28 space-y-4">
          <h2 className="font-extrabold text-base sm:text-lg tracking-tight border-b border-border/50 pb-2">
            {t("order_summary")}
          </h2>
          <div className="flex justify-between items-center text-base sm:text-lg font-extrabold text-foreground">
            <span>{t("total")}</span>
            <span className="text-primary font-mono">
              {totalPrice} {t("currency_symbol")}
            </span>
          </div>
          <Button
            onClick={() => navigate("/checkout")}
            className="w-full h-11 bg-primary text-primary-foreground font-bold rounded-xl cursor-pointer shadow-sm hover:bg-primary/95 transition-all flex items-center justify-center gap-2"
          >
            {t("proceed_to_checkout")}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
