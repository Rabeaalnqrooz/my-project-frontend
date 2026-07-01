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
import { Globe } from "lucide-react";
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
          className="cursor-pointer flex items-center gap-1.5 px-3 text-sm font-medium bg-card border-border shadow-sm text-foreground"
        >
          <Globe className="h-4 w-4" />
          {i18n.language.startsWith("en") ? "العربية" : "English"}
        </Button>

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
            📩
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            {t("verify_otp_title")}
          </h1>
          <p className="text-muted-foreground text-sm">
            {t("verify_otp_desc")}{" "}
            <span className="text-foreground font-medium">{email}</span>
          </p>
        </div>

        {/* ─── الفورم الحاوية ───────────────────────────────────── */}
        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm space-y-4 text-start">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-foreground">
                {t("otp_label")}
              </Label>
              <Input
                placeholder="123456"
                maxLength={6}
                className="h-14 rounded-xl border-border bg-transparent text-foreground focus-visible:ring-primary text-center
                           text-2xl tracking-widest font-mono"
                {...register("otp")}
              />
              {errors.otp && (
                <p className="text-red-500 dark:text-red-400 text-xs text-center font-medium">
                  {errors.otp.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-xl cursor-pointer border-none transition-colors"
              disabled={isLoading}
            >
              {isLoading ? t("verifying") : t("verify_btn")}
            </Button>
          </form>

          {/* إعادة الإرسال */}
          <div className="text-center space-y-2 pt-2 border-t border-border">
            <p className="text-sm text-muted-foreground">
              {t("no_otp_received")}{" "}
              <button
                type="button"
                onClick={handleResend}
                disabled={isLoading}
                className="text-blue-600 dark:text-blue-400 font-medium hover:underline
                           disabled:opacity-40 cursor-pointer"
              >
                {t("resend_btn")}
              </button>
            </p>
            <Link
              to="/forgot-password"
              className="inline-block text-xs text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition"
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
