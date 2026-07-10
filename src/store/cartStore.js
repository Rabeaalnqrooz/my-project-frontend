// frontend/src/store/cartStore.js

import { create } from "zustand";
import api from "@/api/axios";

export const useCartStore = create((set, get) => ({
  // ─── State ────────────────────────────────────────────
  cart: { items: [] },
  isLoading: false,
  error: null,

  // ─── Actions ──────────────────────────────────────────

  // ✅ جلب السلة الحالية
  fetchCart: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get("cart");
      set({ cart: res.data.cart, isLoading: false });
      return res.data;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  // ✅ إضافة منتج للسلة
  addToCart: async (productId, quantity) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post("cart", { productId, quantity });
      set({ cart: res.data.cart, isLoading: false });
      return res.data;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error; // ✅ نرمي الخطأ عشان الصفحة تقدر تعرض Toast برسالة الخطأ الفعلية (مثلاً "الكمية غير كافية")
    }
  },

  // ✅ تحديث كمية منتج بالسلة (تحديد قيمة مباشرة)
  updateQuantity: async (productId, quantity) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.put("cart", { productId, quantity });
      set({ cart: res.data.cart, isLoading: false });
      return res.data;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  // ✅ حذف منتج من السلة
  removeItem: async (productId) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.delete(`cart/${productId}`);
      set({ cart: res.data.cart, isLoading: false });
      return res.data;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  // ✅ تفريغ السلة بالكامل
  clearCart: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.delete("cart/clear");
      set({ cart: res.data.cart, isLoading: false });
      return res.data;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  // ✅ حساب عدد العناصر الكلي بالسلة (لعرضه بالـ Navbar كـ badge رقمي)
  getItemsCount: () => {
    const { cart } = get();
    return cart.items.reduce((sum, item) => sum + item.quantity, 0);
  },

  // ✅ حساب السعر الإجمالي للسلة (يعتمد على السعر الحالي الحي من الـ populate)
  getTotalPrice: () => {
    const { cart } = get();
    return cart.items.reduce((sum, item) => {
      // ✅ حماية: لو وصل عنصر فيه منتج null لأي سبب، نتجاهله بدل ما نكسر الحساب كله
      if (!item.product) return sum;
      const price = item.product.discountPrice || item.product.price;
      return sum + price * item.quantity;
    }, 0);
  },
}));

export default useCartStore;
