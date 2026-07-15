// import React, { useEffect } from "react";
// import { Route, Routes, useLocation } from "react-router-dom";
// import Home from "./pages/Home";
// import Login from "./pages/Login";
// import Signup from "./pages/Signup";
// import Layout from "./components/Layout";
// // import VerifyEmail from "./pages/VerifyEmail";
// import Profile from "./pages/Profile";
// // import ForgotPassword from "./pages/ForgotPassword";
// // import VerifyOTP from "./pages/VerifyOTP";
// import ResetPassword from "./pages/ResetPassword";
// import AdminUsers from "./pages/admin/AdminUsers";
// import AdminRoute from "@/components/AdminRoute";
// import ProtectedRoute from "./components/ProtectedRoute";
// import Products from "./pages/Products";
// import ProductDetails from "./pages/ProductDetails";
// import Cart from "./pages/Cart";
// import Checkout from "./pages/Checkout";
// import OrderDetails from "./pages/OrderDetails";
// import MyOrders from "./pages/MyOrders";
// import AdminLayout from "./components/admin/AdminLayout";
// import AdminDashboard from "./pages/admin/AdminDashboard";
// import AdminCategories from "./pages/admin/AdminCategories";
// import AdminProducts from "./pages/admin/AdminProducts";
// import AdminOrders from "./pages/admin/AdminOrders";
// import About from "./pages/About";
// import Contact from "./pages/Contact";
// import PrivacyPolicy from "./pages/PrivacyPolicy";
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
// function App() {
//   return (
//     <>
//       <ScrollToTop />
//       <Routes>
//         <Route element={<Layout />}>
//           <Route path="/" element={<Home />} />
//           <Route path="/products" element={<Products />} />
//           <Route path="/products/:slug" element={<ProductDetails />} />
//           <Route path="/about" element={<About />} />
//           <Route path="/contact" element={<Contact />} />
//           <Route path="/privacy" element={<PrivacyPolicy />} />
//           {/* Protect */}
//           <Route element={<ProtectedRoute />}>
//             <Route path="/profile" element={<Profile />} />
//             <Route path="/cart" element={<Cart />} />
//             <Route path="/checkout" element={<Checkout />} />
//             <Route path="/orders" element={<MyOrders />} />
//             <Route path="/orders/:id" element={<OrderDetails />} />
//             <Route path="/reset-password" element={<ResetPassword />} />
//           </Route>
//           {/* admain */}
//           <Route element={<AdminRoute />}>
//             <Route element={<AdminLayout />}>
//               <Route path="/admin" element={<AdminDashboard />} />
//               <Route path="/admin/users" element={<AdminUsers />} />
//               <Route path="/admin/categories" element={<AdminCategories />} />
//               <Route path="/admin/products" element={<AdminProducts />} />
//               <Route path="/admin/orders" element={<AdminOrders />} />
//               {/* لاحقاً رح نضيف هون: /admin/products, /admin/categories, /admin/orders */}
//             </Route>
//           </Route>
//         </Route>

//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />
//         {/* <Route path="/verify/:token" element={<VerifyEmail />} />
//         <Route path="/forgot-password" element={<ForgotPassword />} />
//         <Route path="/verify-otp" element={<VerifyOTP />} /> */}

//         {/* 👈 المسار الجديد */}
//       </Routes>
//     </>
//   );
// }

// export default App;
// frontend/src/App.jsx

import React, { Suspense, lazy, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import useAuthStore from "@/store/authStore";

import Layout from "./components/Layout";
import AdminRoute from "@/components/AdminRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/admin/AdminLayout";
import ScrollToTop from "./components/ScrollToTop";

// ============================================================
// 🚀 CODE SPLITTING — كل صفحة بتتحمّل بس لما حد يزورها فعلياً
// ============================================================
// ✅ بدل الاستيراد المباشر (import X from "./pages/X")، نستخدم
// React.lazy(() => import(...)) — هاد بيخلي Vite يقسم كل صفحة
// لملف (chunk) منفصل، يتحمّل عند الطلب بس مش بأول تحميل للموقع

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
// const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));
const Profile = lazy(() => import("./pages/Profile"));
// const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
// const VerifyOTP = lazy(() => import("./pages/VerifyOTP"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Products = lazy(() => import("./pages/Products"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const OrderDetails = lazy(() => import("./pages/OrderDetails"));
const MyOrders = lazy(() => import("./pages/MyOrders"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));

// ✅ صفحات الأدمن — أكبر جزء بالكود، وأقل جزء استخداماً (أدمن بس)
// هاي أكتر مكان رح تحس فيه بفرق الحجم بعد التقسيم
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminCategories = lazy(() => import("./pages/admin/AdminCategories"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts"));
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders"));

// ============================================================
// ⏳ شاشة تحميل بسيطة تظهر أثناء تحميل أي صفحة (Chunk) جديدة
// ============================================================
function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );
}

function App() {
  const initAuth = useAuthStore((state) => state.initAuth);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <>
      <ScrollToTop />
      {/* ✅ Suspense بيلف كل الـ Routes — أي صفحة قيد التحميل (Lazy Loading)
          بتعرض PageLoader تلقائياً لحد ما يوصل الكود ويجهز */}
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:slug" element={<ProductDetails />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/orders" element={<MyOrders />} />
              <Route path="/orders/:id" element={<OrderDetails />} />
              <Route path="/reset-password" element={<ResetPassword />} />
            </Route>

            <Route element={<AdminRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/categories" element={<AdminCategories />} />
                <Route path="/admin/products" element={<AdminProducts />} />
                <Route path="/admin/orders" element={<AdminOrders />} />
              </Route>
            </Route>
          </Route>

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {/* <Route path="/verify/:token" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOTP />} /> */}
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
