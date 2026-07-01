import React from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
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
import { z } from "zod";
import useAuthStore from "@/store/authStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import ThemeToggle from "../components/ThemeToggle"; // 👈 استيراد مكوّن الـ Dark Mode

function Signup() {
  const { register: registerUser, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  // 🎯 بناء الـ Schema ديناميكياً لترجمة رسائل الخطأ فوراً حسب لغة المستخدم
  const registerSchema = z.object({
    firstName: z.string().min(2, t("validation.first_name_short")),
    lastName: z.string().min(2, t("validation.last_name_short")),
    email: z.string().email(t("invalid_link_error")),
    password: z.string().min(8, t("validation.new_password_short")),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    try {
      await registerUser(data);
      toast.success(t("signup_success"));
      navigate("/login");
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
    // 👈 تحويل الخلفية لـ bg-background والخط لـ text-foreground ليتجاوب برفق مع الـ Dark Mode
    <div className="flex justify-center items-center min-h-screen bg-background text-foreground px-4 relative transition-colors duration-300">
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

      {/* زر العودة للرئيسية - تم تصحيح الألوان لتتضح في السواد */}
      <Link to={"/"} className="absolute top-4 start-4">
        <button className="cursor-pointer text-sm text-muted-foreground hover:text-foreground font-medium transition flex items-center gap-1">
          {i18n.language.startsWith("en") ? "← Back Home" : "← الرئيسية"}
        </button>
      </Link>

      {/* حاوية بطاقة التسجيل - معتمدة على bg-card و border-border المتغيرة تلقائياً */}
      <Card className="w-full max-w-sm shadow-md mt-12 border-border bg-card">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader className="text-start">
            <CardTitle className="text-xl text-foreground">
              {t("signup_title")}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {t("signup_description")}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col gap-4 text-start">
              {/* الاسم الأول */}
              <div className="grid gap-1.5">
                <Label htmlFor="firstName" className="text-foreground">
                  {t("firstName")}
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder={t("firstName")}
                  disabled={isLoading}
                  className="bg-transparent border-border text-foreground focus-visible:ring-primary"
                  {...register("firstName")}
                />
                {errors.firstName && (
                  <p className="text-red-500 dark:text-red-400 text-xs font-medium">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              {/* الاسم الأخير */}
              <div className="grid gap-1.5">
                <Label htmlFor="lastName" className="text-foreground">
                  {t("lastName")}
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder={t("lastName")}
                  disabled={isLoading}
                  className="bg-transparent border-border text-foreground focus-visible:ring-primary"
                  {...register("lastName")}
                />
                {errors.lastName && (
                  <p className="text-red-500 dark:text-red-400 text-xs font-medium">
                    {errors.lastName.message}
                  </p>
                )}
              </div>

              {/* البريد الإلكتروني */}
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

              {/* كلمة المرور */}
              <div className="grid gap-1.5">
                <Label htmlFor="password" className="text-foreground">
                  {t("password")}
                </Label>
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
            {/* زر التسجيل الأزرق المتناسق والمستقر */}
            <Button
              type="submit"
              className="w-full cursor-pointer h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center border-none transition-colors"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin me-2 h-4 w-4" />
                  {t("signing_up")}
                </>
              ) : (
                t("signup_btn")
              )}
            </Button>

            {/* النص السفلي وروابط التنقل المحسنة الألوان */}
            <p className="text-sm text-muted-foreground text-center">
              {t("have_account")}{" "}
              <Link
                to="/login"
                className="hover:underline cursor-pointer text-blue-600 dark:text-blue-400 font-medium"
              >
                {t("login_link")}
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default Signup;
