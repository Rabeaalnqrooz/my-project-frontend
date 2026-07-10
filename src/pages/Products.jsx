// frontend/src/pages/Products.jsx

import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useProductStore from "@/store/productStore";
import useCategoryStore from "@/store/categoryStore";
import ProductCard from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function Products() {
  const { t } = useTranslation();
  const { products, isLoading, totalPages, currentPage, fetchProducts } =
    useProductStore();
  const { categories, fetchCategories } = useCategoryStore();

  const [searchParams, setSearchParams] = useSearchParams();

  const selectedCategory = searchParams.get("category") || "";
  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "";
  const page = Number(searchParams.get("page")) || 1;

  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchProducts({
      category: selectedCategory || undefined,
      search: search || undefined,
      sort: sort || undefined,
      page,
    });
  }, [selectedCategory, search, sort, page, fetchProducts]);

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1");
    setSearchParams(params);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateFilter("search", searchInput);
  };

  const goToPage = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage);
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 mt-6 max-w-7xl">
      {/* قسم العنوان العلوي بتصميم عصري نظيف */}
      <div className="mb-8 border-b border-border/60 pb-5">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          {t("products_title")}
        </h1>
      </div>

      {/* قسم الفلترة والبحث المتجاوب بالكامل */}
      <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between bg-card p-4 sm:p-5 rounded-xl border border-border/50 shadow-sm">
        {/* فوروم البحث: يأخذ كامل العرض في الهواتف وينسق العناصر بداخله */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex w-full items-center gap-2 lg:max-w-md"
        >
          <div className="relative w-full">
            <Input
              placeholder={t("search_placeholder")}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-background/50 h-10 transition-all focus-visible:ring-primary"
            />
          </div>
          <Button
            type="submit"
            variant="default"
            className="h-10 px-5 shrink-0"
          >
            {t("search_btn")}
          </Button>
        </form>

        {/* عناصر الاختيار (Select): تصبح بجانب بعضها في الشاشات المتوسطة وفوق بعضها في الهواتف */}
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <Select
            value={selectedCategory || "all"}
            onValueChange={(value) =>
              updateFilter("category", value === "all" ? "" : value)
            }
          >
            <SelectTrigger className="w-full sm:w-48 h-10 bg-background/50">
              <SelectValue placeholder={t("all_categories")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("all_categories")}</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat._id} value={cat._id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={sort || "newest"}
            onValueChange={(value) =>
              updateFilter("sort", value === "newest" ? "" : value)
            }
          >
            <SelectTrigger className="w-full sm:w-52 h-10 bg-background/50">
              <SelectValue placeholder={t("sort_newest")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">{t("sort_newest")}</SelectItem>
              <SelectItem value="price_asc">{t("sort_price_asc")}</SelectItem>
              <SelectItem value="price_desc">{t("sort_price_desc")}</SelectItem>
              <SelectItem value="best_selling">
                {t("sort_best_selling")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* حالة التحميل المؤثرة */}
      {isLoading && (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm font-medium text-muted-foreground animate-pulse">
            {t("loading")}
          </p>
        </div>
      )}

      {/* حالة عدم وجود منتجات بتصميم مريح للعين */}
      {!isLoading && products.length === 0 && (
        <div className="text-center py-24 bg-muted/20 rounded-2xl border border-dashed border-border/80 p-8">
          <p className="text-base font-medium text-muted-foreground">
            {t("no_products_found")}
          </p>
        </div>
      )}

      {/* شبكة المنتجات (Grid): 1 في الهواتف الصغيرة جداً، 2 في الشاشات العادية، 3 في المتوسطة، 4 في الكبيرة */}
      {!isLoading && products.length > 0 && (
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="transition-all duration-300 hover:-translate-y-1"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}

      {/* أزرار التنقل بين الصفحات (Pagination) بشكل ناعم ومتناسق */}
      {!isLoading && totalPages > 1 && (
        <div className="mt-14 flex items-center justify-center gap-4 border-t border-border/40 pt-6">
          <Button
            variant="outline"
            size="sm"
            className="h-9 px-4 font-medium transition-colors"
            disabled={currentPage <= 1}
            onClick={() => goToPage(currentPage - 1)}
          >
            {t("pagination_prev")}
          </Button>

          <span className="text-xs sm:text-sm font-medium text-muted-foreground bg-muted/60 px-3 py-1.5 rounded-md border border-border/30">
            {t("page_of", { current: currentPage, total: totalPages })}
          </span>

          <Button
            variant="outline"
            size="sm"
            className="h-9 px-4 font-medium transition-colors"
            disabled={currentPage >= totalPages}
            onClick={() => goToPage(currentPage + 1)}
          >
            {t("pagination_next")}
          </Button>
        </div>
      )}
    </div>
  );
}

export default Products;
