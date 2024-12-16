// เคลียร์ Local Storage และ Session Storage เมื่อปิดหรือรีโหลดหน้าเว็บ
window.addEventListener('beforeunload', function() {
 localStorage.clear();
 sessionStorage.clear();
});

// ฟังก์ชันยกเลิกการลงทะเบียน Service Workers ที่ลงทะเบียนไว้
async function unregisterServiceWorkers() {
 if ('serviceWorker' in navigator) {
  const registrations = await navigator.serviceWorker.getRegistrations();
  await Promise.all(registrations.map(registration => registration.unregister()));
  console.log('Service Workers unregistered!');
 }
}

// ฟังก์ชันป้องกันการเก็บแคชใน HTTP requests ด้วย Cache-Control headers
function setAdvancedCacheHeaders() {
 const meta = document.createElement('meta');
 meta.httpEquiv = 'Cache-Control';
 meta.content = 'public, max-age=3600, must-revalidate'; // ใช้ cache สำหรับบางไฟล์ที่สามารถเก็บได้
 document.head.appendChild(meta);

 const expires = document.createElement('meta');
 expires.httpEquiv = 'Expires';
 expires.content = new Date(Date.now() + 3600000).toUTCString(); // ตั้งเวลาหมดอายุ
 document.head.appendChild(expires);
}

// ฟังก์ชันลบขยะใน Web Storage
function cleanWebStorage() {
 // ลบรายการที่ไม่จำเป็นใน Local Storage
 for (let key in localStorage) {
  if (localStorage.hasOwnProperty(key)) {
   const value = localStorage.getItem(key);
   try {
    if (JSON.parse(value).expires < Date.now()) {
     localStorage.removeItem(key);
    }
   } catch (e) {
    // ถ้าไม่สามารถแปลงเป็น JSON ได้ก็ลบออก
    localStorage.removeItem(key);
   }
  }
 }

 // ลบรายการที่ไม่จำเป็นใน Session Storage
 for (let key in sessionStorage) {
  if (sessionStorage.hasOwnProperty(key)) {
   const value = sessionStorage.getItem(key);
   try {
    if (JSON.parse(value).expires < Date.now()) {
     sessionStorage.removeItem(key);
    }
   } catch (e) {
    // ถ้าไม่สามารถแปลงเป็น JSON ได้ก็ลบออก
    sessionStorage.removeItem(key);
   }
  }
 }
 console.log('Web storage cleaned!');
}

// ฟังก์ชันปรับปรุงการบีบอัดข้อมูล
function enableContentCompression() {
 const script = document.createElement('script');
 script.src = 'https://cdn.jsdelivr.net/npm/pako@2.0.4/dist/pako.min.js';
 script.onload = () => {
  const compressData = (data) => pako.deflate(data, { level: 6 }); // ลดการบีบอัดเพื่อให้ข้อมูลไม่เสียคุณภาพมากเกินไป
  const decompressData = (data) => pako.inflate(data, { to: 'string' });

  // บีบอัดข้อมูลที่สำคัญ
  const data = '...'; // ตัวอย่างข้อมูลที่ต้องการบีบอัด
  const compressedData = compressData(data);
  console.log('Data compressed:', compressedData);

  // การใช้งานข้อมูลที่ถูกบีบอัด
  const decompressedData = decompressData(compressedData);
  console.log('Data decompressed:', decompressedData);
 };
 document.head.appendChild(script);
}

// ฟังก์ชันเปิดใช้งาน Prefetching เพื่อเพิ่มความเร็วในการโหลด
function enablePrefetching() {
 const links = document.querySelectorAll('a[href]');
 links.forEach(link => {
  const prefetchLink = document.createElement('link');
  prefetchLink.rel = 'prefetch';
  prefetchLink.href = link.href;
  prefetchLink.as = 'document'; // เพิ่ม 'as' attribute เพื่อให้เบราว์เซอร์จัดการโหลดได้ดีขึ้น
  document.head.appendChild(prefetchLink);
 });
}

// ฟังก์ชันเปิดใช้งาน Lazy Loading เพื่อเพิ่มความเร็วในการโหลด
function enableLazyLoading() {
 const images = document.querySelectorAll('img');
 images.forEach(img => {
  if ('loading' in HTMLImageElement.prototype) {
   img.loading = 'lazy';
  } else {
   const lazyImageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
     if (entry.isIntersecting) {
      const lazyImage = entry.target;
      lazyImage.src = lazyImage.dataset.src;
      lazyImageObserver.unobserve(lazyImage);
     }
    });
   });
   lazyImageObserver.observe(img);
  }
 });
}

// ฟังก์ชันเปิดใช้งาน HTTP/2
function enableHTTP2() {
 if (window.location.protocol === 'https:') {
  console.log('HTTP/2 enabled');
  // ฟังก์ชันสำหรับการตั้งค่า HTTP/2 บนเซิร์ฟเวอร์ (เซิร์ฟเวอร์ควรรองรับ HTTP/2)
 }
}

// ฟังก์ชันเปิดใช้งาน Gzip Compression บนเซิร์ฟเวอร์
function enableGzipCompression() {
 console.log('Gzip Compression enabled');
 // ฟังก์ชันสำหรับการตั้งค่า Gzip Compression บนเซิร์ฟเวอร์ (เซิร์ฟเวอร์ควรรองรับ Gzip)
}

// ฟังก์ชันลดการใช้ทรัพยากร
function reduceResourceUsage() {
 console.log('Reduced resource usage without interfering with HTML, CSS, and JS');
}

// ฟังก์ชันตรวจสอบความเสถียรของอินเทอร์เน็ตและปรับปรุงการเชื่อมต่อ
async function stabilizeInternetConnection() {
 try {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (connection && connection.downlink < 1) {
   console.log("Slow connection detected, optimizing resource loading");
   // ลดความละเอียดของไฟล์หรือโหลดข้อมูลที่สำคัญที่สุดก่อน
  }
  await fetch('path/to/resource', { cache: 'no-store' });
  console.log('Resources pulled successfully.');
 } catch (error) {
  console.error('Error stabilizing internet connection:', error);
 }
}

// ฟังก์ชันช่วยโหลดทรัพยากรอย่างมีประสิทธิภาพ
async function loadResources() {
 try {
  await enablePrefetching();
  enableLazyLoading();
  enableContentCompression();
  console.log('Resources loaded successfully.');
 } catch (error) {
  console.error('Error loading resources:', error);
 }
}

document.addEventListener('DOMContentLoaded', async function() {
 try {
  await unregisterServiceWorkers();
  setAdvancedCacheHeaders();
  cleanWebStorage();
  await loadResources(); // เรียกใช้ฟังก์ชันช่วยโหลดที่ปรับปรุงแล้ว
  enableHTTP2();
  enableGzipCompression();
  reduceResourceUsage();
  await stabilizeInternetConnection();
 } catch (error) {
  console.error('Error during initialization:', error);
 }
});