// frontend/src/components/ScrollToTop.jsx

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// ✅ كومبوننت بسيط بدون أي واجهة مرئية (بيرجع null دايماً) —
// وظيفته الوحيدة: مراقبة تغيّر الرابط، وتصفير التمرير لأعلى الصفحة تلقائياً
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default ScrollToTop;
