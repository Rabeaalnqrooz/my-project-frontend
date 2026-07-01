import React, { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Globe } from "lucide-react";
import useAuthStore from "@/store/authStore";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import ThemeToggle from "./ThemeToggle";

function Navbar() {
  const { t, i18n } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [open, setOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef();
  const mobileMenuRef = useRef();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      setOpen(false);
      setMobileMenuOpen(false);
      toast.info(t("toast_logout_success"));
      navigate("/login");
    } catch (error) {
      toast.error(t("toast_logout_error"));
    }
  };

  const toggleLanguage = () => {
    const nextLang = i18n.language.startsWith("en") ? "ar" : "en";
    i18n.changeLanguage(nextLang);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    // 👈 تعديل الخلفية والحدود لـ bg-background و border-border ليتغير الثيم تلقائياً
    <nav className="fixed top-0 start-0 w-full z-50 border-b border-border bg-background text-foreground transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between relative">
        {/* 1. شعار المتجر */}
        <Link to={"/"}>
          <h1 className="text-2xl font-bold text-foreground">{t("logo")}</h1>
        </Link>

        {/* 2. روابط التنقل (Desktop) */}
        <ul className="gap-6 items-center hidden lg:flex">
          <li>
            {/* 👈 تعديل الـ hover ليتوافق مع درجة النصوص المتغيرة */}
            <Link
              to={"/"}
              className="text-foreground hover:text-muted-foreground transition"
            >
              {t("home")}
            </Link>
          </li>
        </ul>

        {/* 3. أزرار التحكم والعمليات */}
        <div className="flex items-center gap-4">
          {/* الزر العالمي لتحويل اللغة */}
          <Button
            onClick={toggleLanguage}
            variant="ghost"
            className="cursor-pointer flex items-center gap-1.5 px-2 text-sm font-medium text-foreground hover:bg-muted"
          >
            <Globe className="h-4 w-4" />
            {i18n.language.startsWith("en") ? "العربية" : "English"}
          </Button>

          {/* زر تبديل الوضع الليلي والنهاري */}
          <ThemeToggle />

          {/* حالة: المستخدم لـم يسجل دخوله (Desktop) */}
          {!user && (
            <div className="hidden lg:flex gap-3">
              <Link to="/login">
                <Button
                  variant="outline"
                  className="cursor-pointer border-border text-foreground hover:bg-muted"
                >
                  {t("login")}
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90">
                  {t("signup")}
                </Button>
              </Link>
            </div>
          )}

          {/* حالة: المستخدم مسجّل دخوله (Desktop + Mobile) */}
          {user && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 cursor-pointer focus:outline-none text-foreground"
              >
                <img
                  src={user.profilePic}
                  alt="avatar"
                  className="w-9 h-9 rounded-full object-cover border border-border"
                />
                <div className="text-start hidden sm:block">
                  <p className="text-xs font-semibold leading-tight text-foreground">
                    {user.firstName || t("default_user_name")}
                  </p>
                  {/* 👈 تعديل نص الـ Role لـ text-muted-foreground المتغير تلقائياً */}
                  <p className="text-[10px] text-muted-foreground">
                    {user.role === "admin" ? t("role_admin") : t("role_user")}
                  </p>
                </div>
              </button>

              {/* القائمة المنسدلة للمستخدم */}
              {open && (
                // 👈 تم تعديل الخلفية لـ bg-card والحدود لـ border-border والنصوص لتصبح متجاوبة تماماً
                <div className="absolute end-0 mt-2 w-44 bg-card text-card-foreground border border-border rounded-xl shadow-xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {user?.role === "admin" && (
                    <Link
                      to="/admin/users"
                      onClick={() => setOpen(false)}
                      className="block px-4 py-2 text-sm hover:bg-muted rounded-lg text-start text-foreground"
                    >
                      {t("admin")}
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    onClick={() => setOpen(false)}
                    className="block px-4 py-2 text-sm hover:bg-muted rounded-lg text-start text-foreground"
                  >
                    {t("profile")}
                  </Link>

                  <hr className="my-1 border-border" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-start block px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg cursor-pointer"
                  >
                    {t("logout")}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* قائمة الموبايل (الهامبرغر) */}
          <div className="lg:hidden" ref={mobileMenuRef}>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="border border-border p-2 rounded-xl bg-card text-foreground hover:bg-muted cursor-pointer text-xl"
            >
              {mobileMenuOpen ? "✕" : "☰"}
            </button>

            {mobileMenuOpen && (
              // 👈 تعديل حاوية القائمة المتنقلة للموبايل لتدعم ألوان الـ Card والـ Border المتغيرة
              <div className="absolute end-4 top-16 w-64 bg-card text-card-foreground border border-border rounded-2xl shadow-xl p-5 z-50 flex flex-col gap-5">
                {/* روابط الموبايل */}
                <ul className="flex flex-col gap-4 font-medium text-muted-foreground text-start">
                  <li>
                    <Link
                      to="/"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-1 text-foreground hover:text-muted-foreground"
                    >
                      {t("home")}
                    </Link>
                  </li>
                </ul>

                {/* أزرار الحساب داخل قائمة الموبايل إذا لم يكن مسجلاً */}
                {!user && (
                  <div className="flex flex-col gap-2 pt-2 border-t border-border">
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button
                        variant="outline"
                        className="w-full border-border text-foreground hover:bg-muted"
                      >
                        {t("login")}
                      </Button>
                    </Link>
                    <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                        {t("signup")}
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
