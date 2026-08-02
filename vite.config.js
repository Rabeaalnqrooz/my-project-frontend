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
    minify: "esbuild", // استخدام esbuild السريع والدقيق للإنتاج
    cssCodeSplit: true,
    target: "esnext",
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name].[hash].js`,
        chunkFileNames: `assets/[name].[hash].js`,
        assetFileNames: `assets/[name].[hash].[ext]`,

        // ⚡ تقسيم الاحترافي لـ Vendor Chunks للتخلص من Unused JS
        manualChunks(id) {
          if (id.includes("node_modules")) {
            // 1. النواة الأساسية فقط (React & DOM)
            if (id.includes("react/") || id.includes("react-dom/")) {
              return "vendor-react";
            }
            // 2. التوجيه (Router)
            if (id.includes("react-router")) {
              return "vendor-router";
            }
            // 3. الأيقونات
            if (id.includes("lucide-react")) {
              return "vendor-icons";
            }
            // 4. الإشعارات والـ UI Utilities
            if (
              id.includes("sonner") ||
              id.includes("clsx") ||
              id.includes("tailwind-merge")
            ) {
              return "vendor-ui";
            }
            // 5. الترجمة وإدارة اللغة
            if (id.includes("i18next")) {
              return "vendor-i18n";
            }
            // 6. التحليلات
            if (id.includes("react-ga4")) {
              return "vendor-analytics";
            }
            // أي مكتبة أخرى
            return "vendor-utils";
          }
        },
      },
    },
  },
});
