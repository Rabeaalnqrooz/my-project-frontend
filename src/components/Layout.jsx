// src/components/Layout.jsx

import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

function Layout() {
  return (
    // 👈 أضفنا bg-background و text-foreground لتوحيد ثيم التطبيق بالكامل ومنع أي "ومضات" بيضاء في الوضع الداكن
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
      <Navbar />

      {/* كلاس grow (أو flex-grow) يجبر الـ main على التمدد وأخذ كل المساحة الفارغة */}
      <main className="grow">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default Layout;
