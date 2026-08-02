import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // ⚡ 1. تفعيل ضغط الكود بأقصى كفاءة وتقليل الأحجام
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true, // حذف console.log في الإنتاج لتخفيف الحجم
        drop_debugger: true,
      },
    },
    // ⚡ 2. تجميع وتقسيم CSS بشكل منفصل لكل Chunk لتجنب حظر الرندر الأول
    cssCodeSplit: true,

    rollupOptions: {
      output: {
        entryFileNames: `assets/[name].[hash].js`,
        chunkFileNames: `assets/[name].[hash].js`,
        assetFileNames: `assets/[name].[hash].[ext]`,

        // ⚡ 3. تقسيم المكتبات الخارجية (Vendor Chunks) لمنع تضخم ملف index.js
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (
              id.includes("react") ||
              id.includes("react-dom") ||
              id.includes("react-router-dom")
            ) {
              return "vendor-core"; // مكتبات ريآكت الأساسية في Chunk منفصل
            }
            if (id.includes("lucide-react")) {
              return "vendor-icons"; // الأيقونات في Chunk منفصل
            }
            if (id.includes("react-ga4")) {
              return "vendor-analytics"; // مكتبة تحليلات جوجل
            }
            return "vendor-libs"; // باقي مكتبات Node
          }
        },
      },
    },
  },
});
