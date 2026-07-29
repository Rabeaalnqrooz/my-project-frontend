import React, { useEffect, lazy, Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import ReactGA from "react-ga4"; // 1️⃣ استيراد مكتبة التحليلات
import Layout from "./components/Layout";
import Home from "./pages/Home";
import InstallPrompt from "./components/InstallPrompt";

// ⚡ التحميل الكسول (Lazy Loading) للصفحات والمكونات لتقليل حجم الكود المبدئي وتحسين السرعة
const Products = lazy(() => import("./pages/Products"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const ShippingPolicy = lazy(() => import("./pages/ShippingPolicy"));
const BlogList = lazy(() => import("./pages/BlogList"));
const BlogPost = lazy(() => import("./pages/BlogPost"));

// const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));
const Profile = lazy(() => import("./pages/Profile"));
// const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
// const VerifyOTP = lazy(() => import("./pages/VerifyOTP"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const MyOrders = lazy(() => import("./pages/MyOrders"));
const OrderDetails = lazy(() => import("./pages/OrderDetails"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));

// 🛡️ مكونات الحماية والأدمن
const ProtectedRoute = lazy(() => import("./components/ProtectedRoute"));
const AdminRoute = lazy(() => import("@/components/AdminRoute"));
const AdminLayout = lazy(() => import("./components/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminCategories = lazy(() => import("./pages/admin/AdminCategories"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts"));
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders"));

// 🌀 مؤشر تحميل خفيف وسريع أثناء تنقل المكونات الكسولة
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="w-8 h-8 border-4 border-rose-600 border-t-transparent rounded-full animate-spin" />
  </div>
);

// const ScrollToTop = () => {
//   const { pathname } = useLocation();

//   useEffect(() => {
//     window.scrollTo({
//       top: 0,
//       left: 0,
//       behavior: "instant", // يمنع القفز البصري ويبدأ من الأعلى فوراً
//     });
//   }, [pathname]);

//   return null;
// };

const ScrollToTop = () => {
  const { pathname, search } = useLocation(); // 2️⃣ أضفنا search لتتبع معاملات البحث والروابط مثل الـ Affiliate

  useEffect(() => {
    // التمرير للأعلى فوراً
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });

    // 3️⃣ إرسال تقرير بزيارة الصفحة الحالية لـ Google Analytics
    ReactGA.send({
      hitType: "pageview",
      page: pathname + search,
    });
  }, [pathname, search]); // يتفعل التأثير عند تغير المسار أو معاملات البحث

  return null;
};

function App() {
  return (
    <>
      <ScrollToTop />
      <InstallPrompt />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:slug" element={<ProductDetails />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/shipping-policy" element={<ShippingPolicy />} />
            <Route path="/blog" element={<BlogList />} />
            <Route path="/blog/:id" element={<BlogPost />} />
            {/* Protect */}
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/orders" element={<MyOrders />} />
              <Route path="/orders/:id" element={<OrderDetails />} />
              <Route path="/reset-password" element={<ResetPassword />} />
            </Route>
            {/* admain */}
            <Route element={<AdminRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/categories" element={<AdminCategories />} />
                <Route path="/admin/products" element={<AdminProducts />} />
                <Route path="/admin/orders" element={<AdminOrders />} />
                {/* لاحقاً رح نضيف هون: /admin/products, /admin/categories, /admin/orders */}
              </Route>
            </Route>
          </Route>

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {/* <Route path="/verify/:token" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOTP />} /> */}

          {/* 👈 المسار الجديد */}
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
