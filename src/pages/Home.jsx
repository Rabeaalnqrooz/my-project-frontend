// src/pages/Home.jsx
import React from "react";
import Hero from "@/components/Hero";
import TrustBadges from "@/components/TrustBadges";
import Testimonials from "@/components/Testimonials";

function Home() {
  return (
    <main className="pt-24 min-h-[85vh] bg-background text-foreground overflow-hidden animate-in fade-in duration-500">
      {/* قسم الواجهة الترحيبية الرئيسي */}
      <Hero />

      {/* قسم شارات الثقة والأمان */}
      <TrustBadges />

      {/* 🌟 قسم تجارب وآراء العملاء */}
      <Testimonials />
    </main>
  );
}

export default Home;
