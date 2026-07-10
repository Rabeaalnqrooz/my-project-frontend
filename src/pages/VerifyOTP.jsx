// src/pages/VerifyOTP.jsx

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
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import ThemeToggle from "../components/ThemeToggle"; // 👈 استيراد مكوّن الـ Dark Mode

const otpSchema = z.object({
  otp: z
    .string()
    .length(6, "كود OTP يجب أن يكون 6 أرقام")
    .regex(/^\d+$/, "أرقام فقط"),
});

function VerifyOTP() {
  const { verifyResetOTP, resendResetOTP, isLoading } = useAuthStore();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { state } = useLocation();
  const email = state?.email;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(otpSchema),
  });

  useEffect(() => {
    if (!email) {
      toast.error(t("email_required_error"));
      navigate("/forgot-password");
    }
  }, [email, navigate, t]);

  const onSubmit = async (data) => {
    try {
      const res = await verifyResetOTP({ email, otp: data.otp });
      toast.success(t("otp_verified_success"));
      navigate("/reset-password", {
        state: { resetToken: res.resetToken, email },
      });
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleResend = async () => {
    try {
      await resendResetOTP({ email });
      toast.success(t("otp_resent_success"));
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

        <ThemeToggle />
      </div>

      {/* زر العودة - حركة سهم ديناميكية متجاوبة مع اتجاه لغة الصفحة */}
      <Link to="/forgot-password" className="absolute top-5 start-5 group">
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
          {i18n.language.startsWith("en") ? "Back" : "رجوع"}
        </button>
      </Link>

      {/* الحاوية الرئيسية لصفحة التحقق مع أنيميشن ظهور ناعم */}
      <div className="w-full max-w-md space-y-6 mt-12 sm:mt-0 animate-in fade-in zoom-in-95 duration-200">
        {/* ─── Header ───────────────────────────────────── */}
        <div className="text-center space-y-3">
          {/* صندوق الأيقونة العلوي مع ألوان متناسقة للثيمين */}
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto shadow-sm">
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
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </div>
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
              {t("verify_otp_title")}
            </h1>
            <p className="text-muted-foreground text-xs sm:text-sm max-w-xs mx-auto leading-relaxed">
              {t("verify_otp_desc")}{" "}
              <span className="text-foreground font-semibold break-all">
                {email}
              </span>
            </p>
          </div>
        </div>

        {/* ─── الفورم الحاوية ───────────────────────────────────── */}
        <div className="bg-card/70 backdrop-blur-sm rounded-2xl border border-border/60 p-6 shadow-xl space-y-4 text-start">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs sm:text-sm font-semibold text-foreground/90">
                {t("otp_label")}
              </Label>
              <Input
                placeholder="123456"
                maxLength={6}
                className="h-14 rounded-xl border-border bg-transparent text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0 text-center text-2xl sm:text-3xl tracking-widest font-mono font-bold shadow-inner"
                {...register("otp")}
              />
              {errors.otp && (
                <p className="text-destructive text-xs text-center font-semibold pt-0.5 animate-in fade-in duration-150">
                  {errors.otp.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-primary text-primary-foreground font-bold rounded-xl cursor-pointer flex items-center justify-center gap-2 shadow-sm hover:bg-primary/95 transition-all duration-200"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4" />
                  {t("verifying")}
                </>
              ) : (
                t("verify_btn")
              )}
            </Button>
          </form>

          {/* إعادة الإرسال والتحكم الإضافي */}
          <div className="text-center space-y-2.5 pt-4 border-t border-border/50">
            <p className="text-xs sm:text-sm text-muted-foreground">
              {t("no_otp_received")}{" "}
              <button
                type="button"
                onClick={handleResend}
                disabled={isLoading}
                className="text-primary font-bold hover:underline disabled:opacity-40 disabled:no-underline cursor-pointer transition-colors"
              >
                {t("resend_btn")}
              </button>
            </p>

            <Link
              to="/forgot-password"
              className="inline-block text-xs text-muted-foreground hover:text-primary font-medium transition-colors"
            >
              {t("change_email_link")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerifyOTP;
