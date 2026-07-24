// frontend/src/components/Navbar.jsx

import React, { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Globe, ShoppingCart } from "lucide-react";
import useCartStore from "@/store/cartStore";
import useAuthStore from "@/store/authStore";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import ThemeToggle from "./ThemeToggle";

function Navbar() {
  const { t, i18n } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const cart = useCartStore((state) => state.cart);
  const fetchCart = useCartStore((state) => state.fetchCart);
  const itemsCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

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
    } catch {
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

  // ✅ نجيب السلة أول ما المستخدم يسجل دخول (أو أول ما تفتح الصفحة وهو مسجل أصلاً)
  useEffect(() => {
    if (user) fetchCart();
  }, [user, fetchCart]);

  return (
    // 👈 تم تحويل التثبيت من fixed إلى sticky ليتجاوب بشكل ديناميكي مع الـ AnnouncementBar فوقه دون تداخل
    <nav className="sticky top-0 start-0 w-full z-50 border-b border-border/50 bg-background/80 backdrop-blur-md text-foreground transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between relative">
        {/* 1. شعار المتجر */}
        <Link to="/" className="flex items-center gap-2.5 group shrink-0">
          <img
            src="/julialogo.webp"
            alt={t("logo")}
            width="70"
            height="70"
            fetchpriority="high"
            className="h-10 sm:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
          <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent hidden sm:block">
            {t("logo")}
          </h1>
        </Link>

        {/* 2. روابط التنقل (Desktop) */}
        <ul className="gap-8 items-center hidden lg:flex font-medium text-sm">
          <li>
            <Link
              to="/"
              className="text-foreground/80 hover:text-foreground relative py-1.5 after:absolute after:bottom-0 after:start-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-primary after:transition-all after:duration-300 transition-colors"
            >
              {t("home")}
            </Link>
          </li>
          <li>
            <Link
              to="/products"
              className="text-foreground/80 hover:text-foreground relative py-1.5 after:absolute after:bottom-0 after:start-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-primary after:transition-all after:duration-300 transition-colors"
            >
              {t("products")}
            </Link>
          </li>

          {/* 👈 الرابط الجديد للمدونة على الـ Desktop بنفس التنسيق والحركات */}
          <li>
            <Link
              to="/blog"
              className="text-foreground/80 hover:text-foreground relative py-1.5 after:absolute after:bottom-0 after:start-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-primary after:transition-all after:duration-300 transition-colors"
            >
              {t("blog")}
            </Link>
          </li>
        </ul>

        {/* 3. أزرار التحكم والعمليات */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* زر تحويل اللغة */}
          <Button
            onClick={toggleLanguage}
            variant="ghost"
            size="sm"
            aria-label={
              i18n.language.startsWith("en")
                ? "التبديل للعربية"
                : "Switch to English"
            }
            className="cursor-pointer flex items-center gap-1.5 h-9 px-2.5 text-xs sm:text-sm font-medium hover:bg-muted/60 text-foreground/90"
          >
            <Globe className="h-4 w-4 text-muted-foreground" />
            <span className="hidden xs:inline">
              {i18n.language.startsWith("en") ? "العربية" : "English"}
            </span>
          </Button>

          {/* أيقونة السلة */}
          {user && (
            <Link to="/cart" className="relative">
              <Button
                variant="ghost"
                size="icon"
                aria-label={t("cart_title")}
                className="cursor-pointer h-9 w-9 text-foreground/90 hover:bg-muted/60 relative"
              >
                <ShoppingCart className="h-[19px] w-[19px]" />
                {itemsCount > 0 && (
                  <span className="absolute top-0.5 end-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground animate-fade-in">
                    {itemsCount}
                  </span>
                )}
              </Button>
            </Link>
          )}

          {/* زر تبديل الوضع الليلي والنهاري */}
          <ThemeToggle />

          {/* حالة: المستخدم لـم يسجل دخوله (Desktop) */}
          {!user && (
            <div className="hidden lg:flex items-center gap-2.5">
              <Link to="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="cursor-pointer h-9 px-4 font-medium text-foreground/90 hover:bg-muted/60"
                >
                  {t("login")}
                </Button>
              </Link>
              <Link to="/signup">
                <Button
                  size="sm"
                  className="cursor-pointer h-9 px-4 font-medium bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                >
                  {t("signup")}
                </Button>
              </Link>
            </div>
          )}

          {/* حالة: المستخدم مسجّل دخوله */}
          {user && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-muted/40 transition-colors cursor-pointer focus:outline-none"
              >
                <img
                  src={user.profilePic}
                  alt="avatar"
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border border-border/60 shadow-sm"
                />
                <div className="text-start hidden md:block max-w-[100px]">
                  <p className="text-xs font-semibold leading-tight truncate text-foreground">
                    {user.firstName || t("default_user_name")}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-medium">
                    {user.role === "admin" ? t("role_admin") : t("role_user")}
                  </p>
                </div>
              </button>

              {open && (
                <div className="absolute end-0 mt-2 w-48 bg-card text-card-foreground border border-border/60 rounded-xl shadow-xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {user?.role === "admin" && (
                    <Link
                      to="/admin/users"
                      onClick={() => setOpen(false)}
                      className="block px-3.5 py-2 text-sm hover:bg-muted rounded-lg text-start transition-colors font-medium"
                    >
                      💼 {t("admin")}
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    onClick={() => setOpen(false)}
                    className="block px-3.5 py-2 text-sm hover:bg-muted rounded-lg text-start transition-colors font-medium"
                  >
                    👤 {t("profile")}
                  </Link>
                  <Link
                    to="/orders"
                    onClick={() => setOpen(false)}
                    className="block px-3.5 py-2 text-sm hover:bg-muted rounded-lg text-start transition-colors font-medium"
                  >
                    📦 {t("my_orders")}
                  </Link>
                  <hr className="my-1.5 border-border/50" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-start block px-3.5 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg cursor-pointer font-medium transition-colors"
                  >
                    🚪 {t("logout")}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* قائمة الموبايل */}
          <div className="lg:hidden flex items-center" ref={mobileMenuRef}>
            <Button
              variant="outline"
              size="icon"
              aria-label={mobileMenuOpen ? "إغلاق القائمة" : "فتح القائمة"}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="h-9 w-9 border-border/60 bg-card/50 hover:bg-muted/80 cursor-pointer text-base rounded-xl"
            >
              {mobileMenuOpen ? "✕" : "☰"}
            </Button>

            {mobileMenuOpen && (
              <div className="absolute end-4 top-[68px] w-60 bg-card/95 backdrop-blur-lg text-card-foreground border border-border/60 rounded-2xl shadow-xl p-4 z-50 flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-200">
                <ul className="flex flex-col gap-1 font-medium text-start">
                  <li>
                    <Link
                      to="/"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-xl text-foreground hover:bg-muted/60 transition-colors"
                    >
                      {t("home")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/products"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-xl text-foreground hover:bg-muted/60 transition-colors"
                    >
                      {t("products")}
                    </Link>
                  </li>

                  {/* 👈 الرابط الجديد للمدونة داخل قائمة الموبايل */}
                  <li>
                    <Link
                      to="/blog"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-xl text-foreground hover:bg-muted/60 transition-colors"
                    >
                      {t("blog")}
                    </Link>
                  </li>

                  {user && (
                    <>
                      <li>
                        <Link
                          to="/cart"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center justify-between px-3 py-2 rounded-xl text-foreground hover:bg-muted/60 transition-colors"
                        >
                          <span>{t("cart")}</span>
                          {itemsCount > 0 && (
                            <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
                              {itemsCount}
                            </span>
                          )}
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/orders"
                          onClick={() => setMobileMenuOpen(false)}
                          className="block px-3 py-2 rounded-xl text-foreground hover:bg-muted/60 transition-colors"
                        >
                          {t("my_orders")}
                        </Link>
                      </li>
                    </>
                  )}
                </ul>

                {!user && (
                  <div className="flex flex-col gap-2 pt-3 border-t border-border/50">
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button
                        variant="outline"
                        className="w-full h-10 border-border/60 text-foreground hover:bg-muted"
                      >
                        {t("login")}
                      </Button>
                    </Link>
                    <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full h-10 bg-primary text-primary-foreground hover:bg-primary/90">
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
