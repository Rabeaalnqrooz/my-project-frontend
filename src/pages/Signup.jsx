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
import { Loader2 } from "lucide-react";
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
      toast.success(t("signup_success_auto"));
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
    <div className="flex justify-center items-center min-h-screen bg-background text-foreground px-4 relative transition-colors duration-300">
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

      {/* زر العودة للرئيسية - بتفاعل حركي عند الـ Hover */}
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

      {/* الـ Card مع تأثير دخول ناعم وانسيابي ومتناسق مع الألوان التناغمية */}
      <Card className="w-full max-w-sm shadow-xl border-border/60 bg-card/70 backdrop-blur-sm p-1 mt-12 animate-in fade-in zoom-in-95 duration-200">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader className="text-start pb-5">
            <CardTitle className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
              {t("signup_title")}
            </CardTitle>
            <CardDescription className="text-muted-foreground text-xs sm:text-sm mt-1">
              {t("signup_description")}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex flex-col gap-4 text-start">
              {/* الاسم الأول */}
              <div className="grid gap-1.5">
                <Label
                  htmlFor="firstName"
                  className="text-xs font-semibold uppercase tracking-wider text-foreground/80"
                >
                  {t("firstName")}
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder={t("firstName")}
                  disabled={isLoading}
                  className="h-10 bg-background border-border/80 text-foreground focus-visible:ring-primary rounded-xl"
                  {...register("firstName")}
                />
                {errors.firstName && (
                  <p className="text-red-500 dark:text-red-400 text-xs font-semibold mt-0.5">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              {/* الاسم الأخير */}
              <div className="grid gap-1.5">
                <Label
                  htmlFor="lastName"
                  className="text-xs font-semibold uppercase tracking-wider text-foreground/80"
                >
                  {t("lastName")}
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder={t("lastName")}
                  disabled={isLoading}
                  className="h-10 bg-background border-border/80 text-foreground focus-visible:ring-primary rounded-xl"
                  {...register("lastName")}
                />
                {errors.lastName && (
                  <p className="text-red-500 dark:text-red-400 text-xs font-semibold mt-0.5">
                    {errors.lastName.message}
                  </p>
                )}
              </div>

              {/* البريد الإلكتروني */}
              <div className="grid gap-1.5">
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

              {/* كلمة المرور */}
              <div className="grid gap-1.5">
                <Label
                  htmlFor="password"
                  className="text-xs font-semibold uppercase tracking-wider text-foreground/80"
                >
                  {t("password")}
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  disabled={isLoading}
                  className="h-10 bg-background border-border/80 text-foreground focus-visible:ring-primary rounded-xl"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-red-500 dark:text-red-400 text-xs font-semibold mt-0.5">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4 mt-2">
            {/* تم ربطه بـ bg-primary ليتناغم لونه مع قالب الموقع في الـ Light والـ Dark Mode */}
            <Button
              type="submit"
              className="w-full cursor-pointer h-10 bg-primary text-primary-foreground font-bold rounded-xl flex items-center justify-center shadow-sm hover:bg-primary/95 transition-all duration-200"
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

            {/* نص تسجيل الدخول إذا كان يملك حساباً */}
            <p className="text-xs sm:text-sm text-muted-foreground text-center font-medium">
              {t("have_account")}{" "}
              <Link
                to="/login"
                className="hover:underline cursor-pointer text-primary font-bold transition-colors"
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
