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
    // ⚡ استخدام المينيفاي الافتراضي الذكي والسريع لـ Vite بدون استدعاء esbuild صريح
    minify: true,
    cssCodeSplit: true,
    target: ["es2020", "chrome80", "safari13.1", "firefox78", "edge88"],
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name].[hash].js`,
        chunkFileNames: `assets/[name].[hash].js`,
        assetFileNames: `assets/[name].[hash].[ext]`,

        // ⚡ التقسيم المخصص للحزم (Vendor Chunks)
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react/") || id.includes("react-dom/")) {
              return "vendor-react";
            }
            if (id.includes("react-router")) {
              return "vendor-router";
            }
            if (id.includes("lucide-react")) {
              return "vendor-icons";
            }
            if (
              id.includes("sonner") ||
              id.includes("clsx") ||
              id.includes("tailwind-merge")
            ) {
              return "vendor-ui";
            }
            if (id.includes("i18next")) {
              return "vendor-i18n";
            }
            if (id.includes("react-ga4")) {
              return "vendor-analytics";
            }
            return "vendor-utils";
          }
        },
      },
    },
  },
});
