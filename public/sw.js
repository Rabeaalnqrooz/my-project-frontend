// 1️⃣ قم بتغيير رقم النسخة مع كل deployment جديد (مثلاً v2, v3, v4...)
const CACHE_NAME = "julia-store-cache-v3";

// الملفات الثابتة فقط (Static Assets)
const urlsToCache = ["/", "/index.html", "/manifest.json"];

// 2️⃣ مرحلة التثبيت: تخزين الملفات الأساسية فوراً وتجاوز الانتظار
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    }),
  );
  self.skipWaiting(); // تفعيل الـ SW الجديد فوراً
});

// 3️⃣ مرحلة التفعيل: مسح جميع الكاشات القديمة فوراً وإعطاء التحكم للنسخة الجديدة
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cache) => {
            // إذا كان اسم الكاش لا يطابق النسخة الحالية، احذفه فوراً
            if (cache !== CACHE_NAME) {
              console.log(" Cleaning old cache:", cache);
              return caches.delete(cache);
            }
          }),
        );
      })
      .then(() => self.clients.claim()), // الاستحواذ على جميع التبويبات المفتوحة فوراً
  );
});

// 4️⃣ استراتيجية Network First للملفات الديناميكية (تمنع الشاشة البيضاء تماماً)
self.addEventListener("fetch", (event) => {
  // عدم التعديل على طلبات الـ API أو الطلبات الخارجية
  if (
    event.request.method !== "GET" ||
    !event.request.url.startsWith(self.location.origin)
  ) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // إذا نجح طلب الشبكة وكانت الاستجابة سليمة، نحدث الكاش بالملف الجديد
        if (
          networkResponse &&
          networkResponse.status === 200 &&
          networkResponse.type === "basic"
        ) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // في حال عدم وجود إنترنت (Offline)، جلب الملف من الكاش
        return caches.match(event.request);
      }),
  );
});
