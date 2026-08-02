// vite.config.js
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // ⚡ تعديل الـ esbuild لحذف الكونسول وتصغير الكود بدون مكتبات خارجية
  esbuild: {
    drop: ["console", "debugger"],
  },
  build: {
    // استخدم esbuild بدلاً من terser
    minify: "esbuild",
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name].[hash].js`,
        chunkFileNames: `assets/[name].[hash].js`,
        assetFileNames: `assets/[name].[hash].[ext]`,
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react") || id.includes("react-dom") || id.includes("react-router-dom")) {
              return "vendor-core";
            }
            if (id.includes("lucide-react")) {
              return "vendor-icons";
            }
            if (id.includes("react-ga4")) {
              return "vendor-analytics";
            }
            return "vendor-libs";
          }
        },
      },
    },
  },
});