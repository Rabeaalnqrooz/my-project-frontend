// src/pages/ForgotPassword.jsx

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import ThemeToggle from "../components/ThemeToggle"; // 👈 استيراد مكوّن الـ Dark Mode

const forgotSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صالح"),
});

function ForgotPassword() {
  const { forgotPassword, isLoading } = useAuthStore();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data) => {
    try {
      await forgotPassword(data);
      toast.success(t("otp_sent_success"));
      navigate("/verify-otp", { state: { email: data.email } });
    } catch (error) {
      toast.error(error.message);
    }
  };

  const toggleLanguage = () => {
    const nextLang = i18n.language.startsWith("en") ? "ar" : "en";
    i18n.changeLanguage(nextLang);
  };

  return (
    // 👈 تحويل الخلفية لـ bg-background والنصوص لـ text-foreground المتوافقة مع الوضعين
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

      {/* زر العودة للرئيسية - ألوان مرنة تدعم القوالب الداكنة */}
      <Link to={"/"} className="absolute top-4 start-4">
        <button className="cursor-pointer text-sm text-muted-foreground hover:text-foreground font-medium transition">
          {i18n.language.startsWith("en") ? "⬅️ Back Home" : "الرئيسية ➡️"}
        </button>
      </Link>

      <div className="w-full max-w-md space-y-6 mt-12 sm:mt-0">
        {/* ─── Header ───────────────────────────────────── */}
        <div className="text-center space-y-2">
          <div
            className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center
                       justify-center text-white text-2xl mx-auto shadow-md"
          >
            🔐
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            {t("forgot_password_title")}
          </h1>
          <p className="text-muted-foreground text-sm">
            {t("forgot_password_desc")}
          </p>
        </div>

        {/* ─── الفورم الحاوية - تم استبدال الألوان الثابتة بـ bg-card و border-border ─── */}
        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm text-start">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-foreground">
                {t("email")}
              </Label>
              <Input
                type="email"
                placeholder="example@gmail.com"
                className="h-11 rounded-xl border-border bg-transparent text-foreground focus-visible:ring-primary"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-500 dark:text-red-400 text-xs font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-xl cursor-pointer border-none transition-colors"
              disabled={isLoading}
            >
              {isLoading ? t("sending") : t("send_otp_btn")}
            </Button>
          </form>
        </div>

        {/* الرابط السفلي متناسق ومعزز الألوان للوضعين */}
        <p className="text-center text-sm text-muted-foreground">
          {t("remember_password")}{" "}
          <Link
            to="/login"
            className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
          >
            {t("login_link_back")}
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
