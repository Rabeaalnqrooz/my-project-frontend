// frontend/src/pages/Bundles.jsx

import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import useProductStore from "@/store/productStore";
import ProductCard from "@/components/ProductCard";

function Bundles() {
  const { t } = useTranslation();
  const { products, isLoading, fetchProducts } = useProductStore();

  useEffect(() => {
    // ✅ نفس دالة fetchProducts الموجودة أصلاً، بس بفلتر bundlesOnly
    fetchProducts({ bundlesOnly: true });
  }, [fetchProducts]);

  return (
    <div className="container mx-auto px-4 pt-24 pb-12">
      <h1 className="mb-6 text-2xl font-bold">{t("bundles_title")}</h1>

      {isLoading && (
        <p className="text-center text-muted-foreground">{t("loading")}</p>
      )}

      {!isLoading && products.length === 0 && (
        <p className="text-center text-muted-foreground">
          {t("no_bundles_found")}
        </p>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default Bundles;
