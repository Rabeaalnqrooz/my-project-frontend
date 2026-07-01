// src/pages/ResetPassword.jsx

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import useAuthStore from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import ThemeToggle from "../components/ThemeToggle"; // 👈 استيراد مكوّن الـ Dark Mode

const resetSchema = z
  .object({
    newPassword: z.string().min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل"),
    confirmPassword: z.string().min(1, "تأكيد كلمة المرور مطلوب"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "كلمتا المرور غير متطابقتان",
    path: ["confirmPassword"],
  });

function ResetPassword() {
  const { resetPassword, isLoading } = useAuthStore();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { state } = useLocation();
  const resetToken = state?.resetToken;
  const email = state?.email;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetSchema),
  });

  useEffect(() => {
    if (!resetToken) {
      toast.error(t("session_expired_error"));
      navigate("/forgot-password");
    }
  }, [resetToken, navigate, t]);

  const onSubmit = async (data) => {
    try {
      await resetPassword({
        resetToken,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });
      toast.success(t("reset_password_success"));
      navigate("/login");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const toggleLanguage = () => {
    const nextLang = i18n.language.startsWith("en") ? "ar" : "en";
    i18n.changeLanguage(nextLang);
  };

  return (
    // 👈 تحويل الخلفية لـ bg-background والخط لـ text-foreground
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4 relative transition-colors duration-300">
      {/* أدوات التحكم العلوية (اللغة + الثيم) */}
      <div className="absolute top-4 end-4 flex items-center gap-2">
        <Button
          onClick={toggleLanguage}
          variant="outline"
          className="cursor-pointer flex items-center gap-1.5 px-3 text-sm font-medium bg-card border-border shadow-sm text-foreground"
        >
          <Globe className="h-4 w-4" />
          {i18n.language.startsWith("en") ? "العربية" : "English"}
        </Button>

        {/* 👈 إضافة زر الـ Dark Mode هنا */}
        <ThemeToggle />
      </div>

      {/* زر العودة */}
      <Link to={"/forgot-password"} className="absolute top-4 start-4">
        <button className="cursor-pointer text-sm text-muted-foreground hover:text-foreground font-medium transition">
          {i18n.language.startsWith("en") ? "⬅️ Back" : "رجوع ➡️"}
        </button>
      </Link>

      <div className="w-full max-w-md space-y-6 mt-12 sm:mt-0">
        {/* ─── Header ───────────────────────────────────── */}
        <div className="text-center space-y-2">
          <div
            className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center
                       justify-center text-white text-2xl mx-auto shadow-md"
          >
            🔑
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            {t("reset_password_title")}
          </h1>
          <p className="text-muted-foreground text-sm">
            {t("reset_password_desc")}{" "}
            <span className="text-foreground font-medium">{email}</span>
          </p>
        </div>

        {/* ─── الفورم الحاوية - تم تحويلها لـ bg-card و border-border ─────────────────── */}
        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm text-start space-y-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* field 1 */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-foreground">
                {t("new_password_label")}
              </Label>
              <Input
                type="password"
                placeholder="••••••••"
                className="h-11 rounded-xl border-border bg-transparent text-foreground focus-visible:ring-primary"
                {...register("newPassword")}
              />
              {errors.newPassword && (
                <p className="text-red-500 dark:text-red-400 text-xs font-medium">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            {/* field 2 */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-foreground">
                {t("confirm_password_label")}
              </Label>
              <Input
                type="password"
                placeholder="••••••••"
                className="h-11 rounded-xl border-border bg-transparent text-foreground focus-visible:ring-primary"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 dark:text-red-400 text-xs font-medium">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-xl cursor-pointer border-none transition-colors"
              disabled={isLoading}
            >
              {isLoading ? t("saving") : t("save_password_btn")}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
