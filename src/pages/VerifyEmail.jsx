// src/pages/VerifyEmail.jsx

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Link, useParams } from "react-router-dom";
import api from "@/api/axios";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import ThemeToggle from "../components/ThemeToggle"; // 👈 استيراد مكوّن الـ Dark Mode

function VerifyEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState(""); // 👈 تصحيح الخطأ الإملائي من setMassage إلى setMessage
  const hasFetched = useRef(false);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const verify = async () => {
      try {
        const res = await api.get(`user/verify/${token}`);
        setStatus("success");
        setMessage(res.data.message || t("verify_email_success_desc"));
      } catch (error) {
        setStatus("error");
        setMessage(
          error.response?.data?.message ||
            error.message ||
            t("verify_email_failed_desc"),
        );
      }
    };

    if (token) verify();
    else {
      setStatus("error");
      setMessage(t("invalid_link_error"));
    }
  }, [token, t]);

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

      {/* حاوية بطاقة الحالة - مع أنيميشن ظهور ناعم وانسيابي وتأثير زجاجي خفيف */}
      <Card className="relative mx-auto w-full max-w-sm pt-0 shadow-xl border-border/60 bg-card/70 backdrop-blur-sm p-1 animate-in fade-in zoom-in-95 duration-200">
        {/* ─── حالة جاري التحقق ─────────────────── */}
        {status === "loading" && (
          <CardHeader className="text-center py-10 space-y-4">
            <div className="flex justify-center">
              <Loader2 className="animate-spin h-10 w-10 text-primary" />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-xl font-extrabold tracking-tight text-foreground">
                {t("checking_title")}
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm text-muted-foreground">
                {t("please_wait_desc")}
              </CardDescription>
            </div>
          </CardHeader>
        )}

        {/* ─── حالة نجاح التفعيل ─────────────────── */}
        {status === "success" && (
          <>
            <CardHeader className="text-center py-6 space-y-3">
              {/* أيقونة نجاح متجهة واحترافية بدلاً من الإيموجي النصي */}
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div className="space-y-1">
                <CardTitle className="text-xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400">
                  {t("verify_email_success_title")}
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm text-muted-foreground px-2 leading-relaxed">
                  {message}
                </CardDescription>
              </div>
            </CardHeader>
            <CardFooter className="pb-6 pt-2">
              <Button
                asChild
                className="w-full cursor-pointer h-10 bg-primary text-primary-foreground font-bold rounded-xl flex items-center justify-center shadow-sm hover:bg-primary/95 transition-all duration-200"
              >
                <Link to="/login">{t("login_link_back")}</Link>
              </Button>
            </CardFooter>
          </>
        )}

        {/* ─── حالة فشل التفعيل ─────────────────── */}
        {status === "error" && (
          <>
            <CardHeader className="text-center py-6 space-y-3">
              {/* أيقونة فشل متجهة واحترافية بدلاً من الإيموجي النصي */}
              <div className="w-12 h-12 rounded-full bg-destructive/10 dark:bg-destructive/20 text-destructive flex items-center justify-center mx-auto shadow-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </div>
              <div className="space-y-1">
                <CardTitle className="text-xl font-extrabold tracking-tight text-destructive">
                  {t("verify_email_failed_title")}
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm text-muted-foreground px-2 leading-relaxed">
                  {message}
                </CardDescription>
              </div>
            </CardHeader>
            <CardFooter className="pb-6 pt-2">
              <Button
                asChild
                className="w-full cursor-pointer h-10 bg-primary text-primary-foreground font-bold rounded-xl flex items-center justify-center shadow-sm hover:bg-primary/95 transition-all duration-200"
              >
                <Link to="/login">{t("return_to_login")}</Link>
              </Button>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  );
}

export default VerifyEmail;
