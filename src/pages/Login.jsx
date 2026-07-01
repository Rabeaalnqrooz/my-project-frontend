import React from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAuthStore from "@/store/authStore";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Loader2, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import ThemeToggle from "../components/ThemeToggle"; // 👈 استيراد مكوّن الـ Dark Mode

function Login() {
  const { login, isLoading } = useAuthStore();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  // 🎯 بناء الـ Schema ديناميكياً ليدعم ترجمة أخطاء الـ Validation مباشرة
  const loginSchema = z.object({
    email: z.string().email(t("invalid_link_error")),
    password: z.string().min(8, t("validation.new_password_short")),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await login(data);
      const loggedUser = response?.user;

      toast.success(
        `${i18n.language === "ar" ? "أهلاً بك مجدداً" : "Welcome back"}, ${loggedUser?.firstName || t("default_user_name")}! ✨`,
      );
      navigate("/");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        t("toast.process_failed_error");
      toast.error(errorMessage);
    }
  };

  const toggleLanguage = () => {
    const nextLang = i18n.language.startsWith("en") ? "ar" : "en";
    i18n.changeLanguage(nextLang);
  };

  return (
    // 👈 تعديل الخلفية العامة لتصبح ديناميكية bg-background وتغيير النص لـ text-foreground
    <div className="flex justify-center items-center min-h-screen bg-background text-foreground px-4 relative transition-colors duration-300">
      {/* أدوات التحكم العلوية (اللغة + الثيم) - مصفوفة بجانب بعضها بمرونة */}
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

      {/* زر العودة للرئيسية - تم ضبط الألوان لتدعم الـ Dark Mode وتتضح في السواد */}
      <Link to={"/"} className="absolute top-4 start-4">
        <button className="cursor-pointer text-sm text-muted-foreground hover:text-foreground font-medium transition flex items-center gap-1">
          {i18n.language.startsWith("en") ? "← Back Home" : "← الرئيسية"}
        </button>
      </Link>

      {/* الـ Card الخاص بـ Shadcn يتغير لونه داخلياً تلقائياً بمجرد قلب الثيم */}
      <Card className="w-full max-w-sm shadow-md mt-12 border-border bg-card">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader className="text-start">
            <CardTitle className="text-xl text-foreground">
              {t("login_title")}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {t("login_description")}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col gap-4 text-start">
              {/* حقل البريد الإلكتروني */}
              <div className="grid gap-1.5">
                <Label htmlFor="email" className="text-foreground">
                  {t("email")}
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t("email")}
                  disabled={isLoading}
                  className="bg-transparent border-border text-foreground focus-visible:ring-primary"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-red-500 dark:text-red-400 text-xs font-medium">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* حقل كلمة المرور */}
              <div className="grid gap-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-foreground">
                    {t("password")}
                  </Label>
                  <Link
                    to="/forgot-password"
                    className="ms-auto inline-block text-xs text-muted-foreground hover:underline hover:text-foreground"
                  >
                    {t("forgot_password")}
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder={t("password")}
                  disabled={isLoading}
                  className="bg-transparent border-border text-foreground focus-visible:ring-primary"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-red-500 dark:text-red-400 text-xs font-medium">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 mt-4">
            {/* زر تسجيل الدخول المحسّن بلون أساسي يدعم التباين العالي بالوضعين */}
            <Button
              type="submit"
              className="w-full cursor-pointer h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center border-none transition-colors"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin me-2 h-4 w-4" />
                  {t("logging_in")}
                </>
              ) : (
                t("login_btn")
              )}
            </Button>

            {/* النص السفلي وروابط الانتقال تم تحسين ألوانها */}
            <p className="text-sm text-muted-foreground text-center">
              {t("no_account")}{" "}
              <Link
                to="/signup"
                className="hover:underline cursor-pointer text-blue-600 dark:text-blue-400 font-medium"
              >
                {t("signup")}
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default Login;
