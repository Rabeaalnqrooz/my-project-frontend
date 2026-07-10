// frontend/src/pages/admin/AdminProducts.jsx

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import useProductStore from "@/store/productStore";
import useCategoryStore from "@/store/categoryStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Loader2, ImagePlus } from "lucide-react";

const emptyForm = {
  name: "",
  brand: "",
  description: "",
  category: "",
  price: "",
  discountPrice: "",
  stock: "",
  isActive: true,
};

function AdminProducts() {
  const { t } = useTranslation();
  const {
    products,
    isLoading,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  } = useProductStore();
  const { categories, fetchCategories } = useCategoryStore();

  const [formData, setFormData] = useState(emptyForm);
  const [newImages, setNewImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [removedImageIds, setRemovedImageIds] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories(true);
    fetchProducts({ all: true, limit: 50 });
  }, [fetchCategories, fetchProducts]);

  const resetForm = () => {
    setFormData(emptyForm);
    setNewImages([]);
    setExistingImages([]);
    setRemovedImageIds([]);
    setEditingId(null);
  };

  const handleEditClick = (product) => {
    setEditingId(product._id);
    setFormData({
      name: product.name,
      brand: product.brand || "",
      description: product.description,
      category: product.category?._id || product.category,
      price: product.price,
      discountPrice: product.discountPrice || "",
      stock: product.stock,
      isActive: product.isActive,
    });
    setExistingImages(product.images);
    setNewImages([]);
    setRemovedImageIds([]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRemoveExistingImage = (publicId) => {
    setRemovedImageIds((prev) => [...prev, publicId]);
    setExistingImages((prev) =>
      prev.filter((img) => img.publicId !== publicId),
    );
  };

  const handleRemoveNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    const totalImagesAfterSave = existingImages.length + newImages.length;
    if (!editingId && newImages.length === 0) {
      setSubmitError(t("min_one_image_error"));
      return;
    }
    if (editingId && totalImagesAfterSave === 0) {
      setSubmitError(t("min_one_image_edit_error"));
      return;
    }

    setIsSubmitting(true);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("brand", formData.brand);
    data.append("description", formData.description);
    data.append("category", formData.category);
    data.append("price", formData.price);
    if (formData.discountPrice)
      data.append("discountPrice", formData.discountPrice);
    data.append("stock", formData.stock);
    data.append("isActive", formData.isActive);

    newImages.forEach((file) => data.append("images", file));
    removedImageIds.forEach((id) => data.append("removeImages", id));

    try {
      if (editingId) {
        await updateProduct(editingId, data);
      } else {
        await createProduct(data);
      }
      resetForm();
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(t("confirm_delete_product", { name }))) return;
    try {
      await deleteProduct(id);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="space-y-10 mt-12 text-start text-foreground animate-in fade-in duration-300">
      {/* العنوان الرئيسي للقسم */}
      <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight border-b border-border/60 pb-3">
        {t("admin_products_title")}
      </h1>

      {/* ─── نموذج الإضافة/التعديل المطور ────────────────────────────── */}
      <form
        onSubmit={handleSubmit}
        className="max-w-xl space-y-5 rounded-xl border border-border/60 p-6 bg-card/40 backdrop-blur-sm shadow-sm"
      >
        <h2 className="text-base sm:text-lg font-bold text-foreground border-b border-border/40 pb-2">
          {editingId ? t("edit_product_title") : t("add_product_title")}
        </h2>

        <div className="space-y-4">
          <div>
            <Label
              htmlFor="name"
              className="text-xs sm:text-sm font-semibold text-muted-foreground"
            >
              {t("category_name_label")}
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              className="mt-1.5 h-10 rounded-xl border-border/60 focus-visible:ring-primary"
            />
          </div>

          <div>
            <Label
              htmlFor="brand"
              className="text-xs sm:text-sm font-semibold text-muted-foreground"
            >
              {t("brand_label")}
            </Label>
            <Input
              id="brand"
              value={formData.brand}
              onChange={(e) =>
                setFormData({ ...formData, brand: e.target.value })
              }
              className="mt-1.5 h-10 rounded-xl border-border/60 focus-visible:ring-primary"
            />
          </div>

          <div>
            <Label
              htmlFor="description"
              className="text-xs sm:text-sm font-semibold text-muted-foreground"
            >
              {t("product_description_label")}
            </Label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
              rows={4}
              className="mt-1.5 w-full rounded-xl border border-border/60 bg-background/50 p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-all resize-none"
            />
          </div>

          <div>
            <Label className="text-xs sm:text-sm font-semibold text-muted-foreground">
              {t("select_category_label")}
            </Label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData({ ...formData, category: value })
              }
            >
              <SelectTrigger className="mt-1.5 h-10 w-full rounded-xl border-border/60">
                <SelectValue placeholder={t("choose_category_placeholder")} />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {categories.map((cat) => (
                  <SelectItem
                    key={cat._id}
                    value={cat._id}
                    className="rounded-lg"
                  >
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label
                htmlFor="price"
                className="text-xs font-semibold text-muted-foreground"
              >
                {t("price_label")}
              </Label>
              <Input
                id="price"
                type="number"
                min="0"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                required
                className="mt-1.5 h-10 rounded-xl border-border/60 font-mono"
              />
            </div>
            <div>
              <Label
                htmlFor="discountPrice"
                className="text-xs font-semibold text-muted-foreground"
              >
                {t("discount_price_label")}
              </Label>
              <Input
                id="discountPrice"
                type="number"
                min="0"
                value={formData.discountPrice}
                onChange={(e) =>
                  setFormData({ ...formData, discountPrice: e.target.value })
                }
                className="mt-1.5 h-10 rounded-xl border-border/60 font-mono"
              />
            </div>
            <div>
              <Label
                htmlFor="stock"
                className="text-xs font-semibold text-muted-foreground"
              >
                {t("stock_label")}
              </Label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({ ...formData, stock: e.target.value })
                }
                required
                className="mt-1.5 h-10 rounded-xl border-border/60 font-mono"
              />
            </div>
          </div>

          {/* ─── إدارة ومعاينة الصور الحالية ─── */}
          {existingImages.length > 0 && (
            <div className="space-y-1.5 border-t border-border/40 pt-3">
              <Label className="text-xs font-semibold text-muted-foreground">
                {t("current_images_label")}
              </Label>
              <div className="mt-1 flex flex-wrap gap-2.5">
                {existingImages.map((img) => (
                  <div
                    key={img.publicId}
                    className="relative group/img h-16 w-16 rounded-xl overflow-hidden border border-border/60 shadow-sm animate-in fade-in duration-150"
                  >
                    <img
                      src={img.url}
                      alt=""
                      className="h-full w-full object-cover transition-transform group-hover/img:scale-105"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingImage(img.publicId)}
                      className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity text-white"
                    >
                      <X className="h-4 w-4 bg-destructive/90 rounded-full p-0.5 shadow-sm" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── إضافة ومعاينة الصور الجديدة ─── */}
          <div className="space-y-1.5 border-t border-border/40 pt-3">
            <Label
              htmlFor="images"
              className="text-xs sm:text-sm font-semibold text-muted-foreground flex items-center gap-1.5"
            >
              <ImagePlus className="h-4 w-4 text-muted-foreground/80" />
              {editingId ? t("add_new_images_label") : t("images_label")}
            </Label>
            <Input
              id="images"
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                const selectedFiles = Array.from(e.target.files);
                // ✅ نضيف الملفات الجديدة فوق يلي مختار أصلاً، بدل ما نستبدلهم
                setNewImages((prev) => [...prev, ...selectedFiles]);
                // ✅ نصفّر قيمة الـ input عشان لو المستخدم بدو يختار نفس الصورة
                // مرة تانية بعدين، المتصفح يعتبرها "تغيير جديد" ويفعّل onChange
                e.target.value = "";
              }}
              className="mt-1"
            />
            {newImages.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2.5">
                {newImages.map((file, index) => (
                  <div
                    key={index}
                    className="relative group/img h-16 w-16 rounded-xl overflow-hidden border border-border/60 shadow-sm animate-in fade-in duration-150"
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt=""
                      className="h-full w-full object-cover transition-transform group-hover/img:scale-105"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveNewImage(index)}
                      className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity text-white"
                    >
                      <X className="h-4 w-4 bg-destructive/90 rounded-full p-0.5 shadow-sm" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ─── خيار تفعيل رؤية المنتج ─── */}
          {editingId && (
            <div className="flex items-center gap-2 pt-1 border-t border-border/40">
              <label className="flex items-center gap-2 text-sm font-semibold text-foreground/90 cursor-pointer selection:bg-transparent">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="h-4 w-4 rounded-md border-border/60 text-primary focus:ring-primary accent-primary cursor-pointer"
                />
                {t("active_visible_label")}
              </label>
            </div>
          )}
        </div>

        {submitError && (
          <p className="text-xs sm:text-sm font-semibold text-destructive animate-shake">
            {submitError}
          </p>
        )}

        <div className="flex gap-2.5 border-t border-border/40 pt-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-10 px-5 rounded-xl font-bold shadow-sm transition-all"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-1.5">
                <Loader2 className="h-4 w-4 animate-spin" />
                {t("saving_btn")}
              </span>
            ) : editingId ? (
              t("save_changes_admin_btn")
            ) : (
              t("add_btn")
            )}
          </Button>
          {editingId && (
            <Button
              type="button"
              variant="outline"
              onClick={resetForm}
              className="h-10 px-5 rounded-xl font-semibold border-border/60"
            >
              {t("cancel_edit_btn")}
            </Button>
          )}
        </div>
      </form>

      {/* ─── جدول المنتجات الإداري المطور ───────────────────────────────────── */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="min-h-[20vh] flex flex-col items-center justify-center gap-2 text-center text-muted-foreground py-10 animate-in fade-in duration-200">
            <Loader2 className="animate-spin h-7 w-7 text-primary" />
            <p className="text-xs font-medium">{t("loading")}</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border/60 bg-card/20 backdrop-blur-sm shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-muted/60 text-muted-foreground/90 font-bold border-b border-border/60">
                <tr>
                  <th className="p-3.5 text-start font-bold">
                    {t("table_image")}
                  </th>
                  <th className="p-3.5 text-start font-bold">
                    {t("table_name")}
                  </th>
                  <th className="p-3.5 text-start font-bold">
                    {t("table_price")}
                  </th>
                  <th className="p-3.5 text-start font-bold">
                    {t("table_stock")}
                  </th>
                  <th className="p-3.5 text-start font-bold">
                    {t("table_status")}
                  </th>
                  <th className="p-3.5 text-start font-bold">
                    {t("table_actions_admin")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {products.map((product) => (
                  <tr
                    key={product._id}
                    className="transition-colors hover:bg-muted/30 group"
                  >
                    <td className="p-3">
                      <div className="h-11 w-11 rounded-xl overflow-hidden border border-border/40 bg-muted/50 shadow-inner">
                        {product.images?.[0]?.url ? (
                          <img
                            src={product.images[0].url}
                            alt={product.name}
                            className="h-full w-full object-cover transition-transform group-hover:scale-105"
                          />
                        ) : (
                          <div className="h-full w-full bg-muted flex items-center justify-center text-muted-foreground/40 text-xs">
                            N/A
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-3 font-bold text-foreground max-w-[200px] truncate">
                      {product.name}
                    </td>
                    <td className="p-3 font-extrabold text-foreground/90 font-mono">
                      {product.discountPrice || product.price}{" "}
                      <span className="text-xs font-semibold text-muted-foreground/80 font-sans">
                        {t("currency_symbol")}
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-muted-foreground/90 font-mono">
                      {product.stock}
                    </td>
                    <td className="p-3">
                      <Badge
                        variant={product.isActive ? "default" : "secondary"}
                        className="px-2 py-0.5 rounded-full text-[11px] font-bold tracking-wide"
                      >
                        {product.isActive
                          ? t("status_active_admin")
                          : t("status_inactive_admin")}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditClick(product)}
                          className="h-8 px-3 rounded-lg text-xs font-semibold border-border/60 transition-all hover:bg-background shadow-sm"
                        >
                          {t("edit_btn")}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            handleDelete(product._id, product.name)
                          }
                          className="h-8 px-3 rounded-lg text-xs font-bold transition-all shadow-sm"
                        >
                          {t("delete_btn")}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminProducts;
