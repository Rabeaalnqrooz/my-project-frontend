self.addEventListener("install", (e) => {
  console.log("[Service Worker] Installed");
});

self.addEventListener("fetch", (e) => {
  // يمرر الطلبات بشكل طبيعي للشبكة
  e.respondWith(fetch(e.request));
});
