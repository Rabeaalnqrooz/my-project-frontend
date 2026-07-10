// frontend/src/components/ProductCard.jsx

import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function ProductCard({ product }) {
  const { t } = useTranslation();
  const hasDiscount = !!product.discountPrice;

  return (
    <Link to={`/products/${product.slug}`} className="block h-full">
      <Card className="group h-full overflow-hidden border-border/60 bg-card text-card-foreground shadow-sm transition-all duration-300 hover:shadow-md hover:border-border">
        {/* ─── قسم الصورة والشارات ───────────────────────── */}
        <div className="relative aspect-square overflow-hidden bg-muted/40 border-b border-border/40">
          <img
            src={product.images?.[0]?.url}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />

          {/* شارة الخصم - مرنة للاتجاهين */}
          {hasDiscount && (
            <Badge className="absolute top-2.5 end-2.5 bg-destructive text-destructive-foreground font-mono font-bold px-2 py-0.5 text-[11px] border-none shadow-sm shadow-destructive/20 animate-in fade-in duration-300">
              {t("discount_percent", { percent: product.discountPercentage })}
            </Badge>
          )}

          {/* شارة نفاد الكمية */}
          {product.stock === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-[1px] animate-in fade-in duration-200">
              <Badge
                variant="secondary"
                className="px-3 py-1 font-bold tracking-wide shadow-sm"
              >
                {t("out_of_stock")}
              </Badge>
            </div>
          )}
        </div>

        {/* ─── تفاصيل المنتج ───────────────────────────────── */}
        <div className="p-4 space-y-1.5">
          {/* الماركة أو البراند */}
          {product.brand && (
            <p className="text-[11px] font-bold tracking-wider text-muted-foreground/80 uppercase">
              {product.brand}
            </p>
          )}

          {/* اسم المنتج */}
          <h3 className="line-clamp-2 text-sm font-semibold text-foreground/90 group-hover:text-primary transition-colors min-h-[40px] leading-relaxed">
            {product.name}
          </h3>

          {/* الأسعار والعملة */}
          <div className="pt-1 flex items-baseline gap-2 flex-wrap">
            {hasDiscount ? (
              <>
                <span className="text-base font-extrabold text-primary font-mono">
                  {product.discountPrice}{" "}
                  <span className="text-xs font-sans font-medium text-primary/90">
                    {t("currency_symbol")}
                  </span>
                </span>
                <span className="text-xs text-muted-foreground/70 line-through font-mono">
                  {product.price} {t("currency_symbol")}
                </span>
              </>
            ) : (
              <span className="text-base font-extrabold text-primary font-mono">
                {product.price}{" "}
                <span className="text-xs font-sans font-medium text-primary/90">
                  {t("currency_symbol")}
                </span>
              </span>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}

export default ProductCard;
