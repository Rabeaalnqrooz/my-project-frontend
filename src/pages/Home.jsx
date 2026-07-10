import Hero from "@/components/Hero";
import React from "react";

function Home() {
  return (
    <main className="pt-24 min-h-[85vh] bg-background text-foreground overflow-hidden animate-in fade-in duration-500">
      {/* قسم الواجهة الترحيبية الرئيسي للمتجر */}
      <Hero />
    </main>
  );
}

export default Home;
