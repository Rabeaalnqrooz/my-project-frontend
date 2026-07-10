// frontend/src/pages/admin/AdminCategories.jsx

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import useCategoryStore from "@/store/categoryStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
const emptyForm = { name: "", description: "", order: 0, isActive: true };

function AdminCategories() {
  const { t } = useTranslation();
  const {
    categories,
    isLoading,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useCategoryStore();

  const [formData, setFormData] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories(true);
  }, [fetchCategories]);

  const resetForm = () => {
    setFormData(emptyForm);
    setImageFile(null);
    setEditingId(null);
  };

  const handleEditClick = (category) => {
    setEditingId(category._id);
    setFormData({
      name: category.name,
      description: category.description || "",
      order: category.order || 0,
      isActive: category.isActive,
    });
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setIsSubmitting(true);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("order", formData.order);
    data.append("isActive", formData.isActive);
    if (imageFile) data.append("image", imageFile);

    try {
      if (editingId) {
        await updateCategory(editingId, data);
      } else {
        await createCategory(data);
      }
      resetForm();
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(t("confirm_delete_category", { name }))) return;
    try {
      await deleteCategory(id);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="space-y-10 mt-12 text-start text-foreground animate-in fade-in duration-300">
      {/* العنوان الرئيسي للقسم */}
      <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight border-b border-border/60 pb-3">
        {t("admin_categories_title")}
      </h1>

      {/* ─── نموذج الإضافة/التعديل المطور ────────────────────────────── */}
      <form
        onSubmit={handleSubmit}
        className="max-w-md space-y-5 rounded-xl border border-border/60 p-6 bg-card/40 backdrop-blur-sm shadow-sm"
      >
        <h2 className="text-base sm:text-lg font-bold text-foreground border-b border-border/40 pb-2">
          {editingId ? t("edit_category_title") : t("add_category_title")}
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
              htmlFor="description"
              className="text-xs sm:text-sm font-semibold text-muted-foreground"
            >
              {t("category_description_label")}
            </Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="mt-1.5 h-10 rounded-xl border-border/60 focus-visible:ring-primary"
            />
          </div>

          <div>
            <Label
              htmlFor="order"
              className="text-xs sm:text-sm font-semibold text-muted-foreground"
            >
              {t("display_order_label")}
            </Label>
            <Input
              id="order"
              type="number"
              value={formData.order}
              onChange={(e) =>
                setFormData({ ...formData, order: e.target.value })
              }
              className="mt-1.5 h-10 rounded-xl border-border/60 font-mono"
            />
          </div>

          <div>
            <Label
              htmlFor="image"
              className="text-xs sm:text-sm font-semibold text-muted-foreground flex flex-col gap-0.5"
            >
              <span>{t("category_image_label")}</span>
              {editingId && (
                <span className="text-xs font-normal text-muted-foreground/80">
                  ({t("image_optional_edit_note")})
                </span>
              )}
            </Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="mt-1.5 h-10 file:font-semibold rounded-xl border-border/60 text-muted-foreground cursor-pointer"
            />
          </div>

          {/* ─── خيار تفعيل رؤية التصنيف ─── */}
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

      {/* ─── جدول التصنيفات المطور ──────────────────────────────────── */}
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
                    {t("table_status")}
                  </th>
                  <th className="p-3.5 text-start font-bold">
                    {t("table_order")}
                  </th>
                  <th className="p-3.5 text-start font-bold">
                    {t("table_actions_admin")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {categories.map((cat) => (
                  <tr
                    key={cat._id}
                    className="transition-colors hover:bg-muted/30 group"
                  >
                    <td className="p-3">
                      <div className="h-11 w-11 rounded-xl overflow-hidden border border-border/40 bg-muted/50 shadow-inner">
                        {cat.image?.url ? (
                          <img
                            src={cat.image.url}
                            alt={cat.name}
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
                      {cat.name}
                    </td>
                    <td className="p-3">
                      <Badge
                        variant={cat.isActive ? "default" : "secondary"}
                        className="px-2 py-0.5 rounded-full text-[11px] font-bold tracking-wide"
                      >
                        {cat.isActive
                          ? t("status_active_admin")
                          : t("status_inactive_admin")}
                      </Badge>
                    </td>
                    <td className="p-3 font-semibold text-muted-foreground/90 font-mono">
                      {cat.order}
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditClick(cat)}
                          className="h-8 px-3 rounded-lg text-xs font-semibold border-border/60 transition-all hover:bg-background shadow-sm"
                        >
                          {t("edit_btn")}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(cat._id, cat.name)}
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

export default AdminCategories;
