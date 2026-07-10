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
import { useTranslation } from "react-i18next";
import ThemeToggle from "../components/ThemeToggle"; // 👈 استيراد مكوّن الـ Dark Mode
import { Loader2 } from "lucide-react";
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
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4 relative transition-colors duration-300">
      {/* أدوات التحكم العلوية (اللغة + الثيم) */}
      <div className="absolute top-4 end-4 flex items-center gap-2">
        <Button
          onClick={toggleLanguage}
          variant="outline"
          size="sm"
          className="cursor-pointer flex items-center gap-1.5 h-9 px-3 text-xs sm:text-sm font-medium bg-card/50 border-border/60 shadow-sm text-foreground/90 hover:bg-muted"
        >
          {/* SVG نقي مدمج للأيقونة يضمن عدم حدوث خطأ Import نهائياً */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 text-muted-foreground"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
          {i18n.language.startsWith("en") ? "العربية" : "English"}
        </Button>

        {/* زر الـ Dark Mode الشغال بسلاسة */}
        <ThemeToggle />
      </div>

      {/* زر العودة للرئيسية - بتفاعل حركي ذكي عند الـ Hover يتجاوب مع اتجاه اللغة */}
      <Link to="/" className="absolute top-5 start-5 group">
        <button className="cursor-pointer text-sm text-muted-foreground hover:text-foreground font-semibold transition-colors flex items-center gap-1.5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1 rtl:group-hover:translate-x-1"
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          {i18n.language.startsWith("en") ? "Back Home" : "الرئيسية"}
        </button>
      </Link>

      {/* الحاوية الرئيسية مع أنيميشن ظهور ناعم */}
      <div className="w-full max-w-md space-y-6 mt-12 sm:mt-0 animate-in fade-in zoom-in-95 duration-200">
        {/* ─── Header ───────────────────────────────────── */}
        <div className="text-center space-y-3">
          {/* استبدال الـ Emoji بأيقونة قفل متجهة احترافية متناسقة مع الهوية اللونية للموقع */}
          <div className="w-14 h-14 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center mx-auto shadow-md transition-all duration-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
            {t("forgot_password_title")}
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm max-w-[320px] mx-auto leading-relaxed">
            {t("forgot_password_desc")}
          </p>
        </div>

        {/* ─── الفورم الحاوية ───────────────────────────────────── */}
        <div className="bg-card/70 backdrop-blur-sm rounded-2xl border border-border/60 p-6 shadow-xl text-start">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* حقل البريد الإلكتروني */}
            <div className="space-y-1.5">
              <Label
                htmlFor="email"
                className="text-xs font-semibold uppercase tracking-wider text-foreground/80"
              >
                {t("email")}
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                disabled={isLoading}
                className="h-10 bg-background border-border/80 text-foreground focus-visible:ring-primary rounded-xl"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-500 dark:text-red-400 text-xs font-semibold mt-0.5">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* زر الإرسال - تم ربطه بـ bg-primary ليعمل الثيم بشكل موحد وسلس */}
            <Button
              type="submit"
              className="w-full h-10 bg-primary text-primary-foreground font-bold rounded-xl cursor-pointer flex items-center justify-center shadow-sm hover:bg-primary/95 transition-all duration-200"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin me-2 h-4 w-4" />
                  {t("sending")}
                </>
              ) : (
                t("send_otp_btn")
              )}
            </Button>
          </form>
        </div>

        {/* الرابط السفلي للعودة لشاشة الدخول - متناسق الألوان */}
        <p className="text-center text-xs sm:text-sm text-muted-foreground font-medium">
          {t("remember_password")}{" "}
          <Link
            to="/login"
            className="hover:underline cursor-pointer text-primary font-bold transition-colors"
          >
            {t("login_link_back")}
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
