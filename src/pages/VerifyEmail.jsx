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
import { Globe } from "lucide-react";
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
    // 👈 تحويل الخلفية العامة إلى bg-background والخط لـ text-foreground المتجاوب
    <div className="flex justify-center items-center min-h-screen bg-background text-foreground px-4 relative transition-colors duration-300">
      {/* أدوات التحكم العلوية (اللغة + الثيم) مصفوفة بمرونة */}
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

      {/* زر العودة للرئيسية - تم تصحيح الألوان والدرجات لتدعم الوضعين */}
      <Link to={"/"} className="absolute top-4 start-4">
        <button className="cursor-pointer text-sm text-muted-foreground hover:text-foreground font-medium transition">
          {i18n.language.startsWith("en") ? "⬅️ Back Home" : "الرئيسية ➡️"}
        </button>
      </Link>

      {/* حاوية بطاقة الحالة - تعتمد على متغيرات bg-card و border-border */}
      <Card className="relative mx-auto w-full max-w-sm pt-0 shadow-md border-border bg-card">
        {/* ─── حالة جاري التحقق ─────────────────── */}
        {status === "loading" && (
          <CardHeader className="text-center py-8">
            <CardTitle className="flex justify-center mt-4 mb-4 text-3xl font-bold text-foreground">
              {t("checking_title")}
            </CardTitle>
            <CardDescription className="text-base flex justify-center text-center text-muted-foreground">
              {t("please_wait_desc")}
            </CardDescription>
          </CardHeader>
        )}

        {/* ─── حالة نجاح التفعيل ─────────────────── */}
        {status === "success" && (
          <>
            <CardHeader className="text-center py-6">
              {/* تعديل لون النجاح ليعطي درجة مريحة بالوضعين الأخضر والـ dark:green */}
              <CardTitle className="flex justify-center mt-4 mb-4 text-2xl font-bold text-green-600 dark:text-green-400">
                ✅ {t("verify_email_success_title")}
              </CardTitle>
              <CardDescription className="text-base flex justify-center text-center text-muted-foreground">
                {message}
              </CardDescription>
            </CardHeader>
            <CardFooter className="pb-6">
              <Button
                asChild
                className="w-full cursor-pointer h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-xl border-none transition-colors"
              >
                <Link to="/login">{t("login_link_back")}</Link>
              </Button>
            </CardFooter>
          </>
        )}

        {/* ─── حالة فشل التفعيل ─────────────────── */}
        {status === "error" && (
          <>
            <CardHeader className="text-center py-6">
              {/* تعديل لون الفشل لدرجة حمراء متناسقة بالوضعين */}
              <CardTitle className="flex justify-center mt-4 mb-4 text-2xl font-bold text-red-600 dark:text-red-400">
                ❌ {t("verify_email_failed_title")}
              </CardTitle>
              <CardDescription className="text-base flex justify-center text-center text-muted-foreground">
                {message}
              </CardDescription>
            </CardHeader>
            <CardFooter className="pb-6">
              <Button
                asChild
                className="w-full cursor-pointer h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-xl border-none transition-colors"
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
