import React, { useEffect, lazy, Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import ReactGA from "react-ga4";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import InstallPrompt from "./components/InstallPrompt";
import Bundles from "./pages/Bundles";
// 🛡️ دالة ذكية لتحميل الصفحات الكسولة وإعادة التحميل تلقائياً عند تحديث الموقع
const safeLazy = (importFn) =>
  lazy(() =>
    importFn().catch((error) => {
      // إذا فشل جلب الـ Chunk بسبب وجود نسخة جديدة على Vercel، نقوم بعمل Reload
      if (
        error.message?.includes(
          "Failed to fetch dynamically imported module",
        ) ||
        error.message?.includes("Importing a module script failed") ||
        error.message?.includes("Loading chunk")
      ) {
        window.location.reload();
      }
      throw error;
    }),
  );

// ⚡ التحميل الكسول الآمن للصفحات
const Products = safeLazy(() => import("./pages/Products"));
const ProductDetails = safeLazy(() => import("./pages/ProductDetails"));
const About = safeLazy(() => import("./pages/About"));
const Contact = safeLazy(() => import("./pages/Contact"));
const PrivacyPolicy = safeLazy(() => import("./pages/PrivacyPolicy"));
const ShippingPolicy = safeLazy(() => import("./pages/ShippingPolicy"));
const BlogList = safeLazy(() => import("./pages/BlogList"));
const BlogPost = safeLazy(() => import("./pages/BlogPost"));

const Profile = safeLazy(() => import("./pages/Profile"));
const ResetPassword = safeLazy(() => import("./pages/ResetPassword"));
const Cart = safeLazy(() => import("./pages/Cart"));
const Checkout = safeLazy(() => import("./pages/Checkout"));
const MyOrders = safeLazy(() => import("./pages/MyOrders"));
const OrderDetails = safeLazy(() => import("./pages/OrderDetails"));
const Login = safeLazy(() => import("./pages/Login"));
const Signup = safeLazy(() => import("./pages/Signup"));

// 🛡️ مكونات الحماية والأدمن
const ProtectedRoute = safeLazy(() => import("./components/ProtectedRoute"));
const AdminRoute = safeLazy(() => import("@/components/AdminRoute"));
const AdminLayout = safeLazy(() => import("./components/admin/AdminLayout"));
const AdminDashboard = safeLazy(() => import("./pages/admin/AdminDashboard"));
const AdminUsers = safeLazy(() => import("./pages/admin/AdminUsers"));
const AdminCategories = safeLazy(() => import("./pages/admin/AdminCategories"));
const AdminProducts = safeLazy(() => import("./pages/admin/AdminProducts"));
const AdminOrders = safeLazy(() => import("./pages/admin/AdminOrders"));

// 🌀 مؤشر تحميل خفيف وسريع
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="w-8 h-8 border-4 border-rose-600 border-t-transparent rounded-full animate-spin" />
  </div>
);

const ScrollToTop = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });

    try {
      ReactGA.send({
        hitType: "pageview",
        page: pathname + search,
      });
    } catch (err) {
      // تجنب توقف الصفحة إذا تعطل AdBlocker/GA
    }
  }, [pathname, search]);

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
            <Route path="/bundles" element={<Bundles />} />

            {/* Protect */}
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/orders" element={<MyOrders />} />
              <Route path="/orders/:id" element={<OrderDetails />} />
              <Route path="/reset-password" element={<ResetPassword />} />
            </Route>

            {/* Admin */}
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
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
