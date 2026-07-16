// src/components/Layout.jsx

import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import AnnouncementBar from "./AnnouncementBar"; // 👈 استيراد شريط إعلانات نون هنا

function Layout() {
  return (
    /* منع أي ومضات بيضاء وتوحيد الخلفية مع حركة تلاشي ناعمة عند دخول التطبيق لأول مرة */
    <div className="flex flex-col min-h-screen w-full bg-background text-foreground transition-colors duration-300 animate-in fade-in duration-500">
      {/* 1. شريط إعلانات نون العلوي */}
      <AnnouncementBar />

      {/* 2. شريط الملاحة العلوي للموقع */}
      <Navbar />

      {/* الحاوية الديناميكية التي تتمدد تلقائياً لتعبئة المساحة الرأسية بالكامل */}
      <main className="grow w-full">
        <Outlet />
      </main>

      {/* التذييل السفلي المستقر دائماً في نهاية الشاشة */}
      <Footer />
    </div>
  );
}

export default Layout;
