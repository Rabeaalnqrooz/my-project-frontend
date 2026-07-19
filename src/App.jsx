import React, { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Layout from "./components/Layout";
// import VerifyEmail from "./pages/VerifyEmail";
import Profile from "./pages/Profile";
// import ForgotPassword from "./pages/ForgotPassword";
// import VerifyOTP from "./pages/VerifyOTP";
import ResetPassword from "./pages/ResetPassword";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminRoute from "@/components/AdminRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderDetails from "./pages/OrderDetails";
import MyOrders from "./pages/MyOrders";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import About from "./pages/About";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ShippingPolicy from "./pages/ShippingPolicy";
import BlogList from "./pages/BlogList";
import BlogPost from "./pages/BlogPost";
import ReactGA from "react-ga4"; // 1️⃣ استيراد مكتبة التحليلات
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
    </>
  );
}

export default App;
