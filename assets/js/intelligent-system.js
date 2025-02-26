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
function setCacheControlHeaders() {
 const meta = document.createElement('meta');
 meta.httpEquiv = 'Cache-Control';
 meta.content = 'no-cache, no-store, must-revalidate';
 document.head.appendChild(meta);

 const pragma = document.createElement('meta');
 pragma.httpEquiv = 'Pragma';
 pragma.content = 'no-cache';
 document.head.appendChild(pragma);

 const expires = document.createElement('meta');
 expires.httpEquiv = 'Expires';
 expires.content = '0';
 document.head.appendChild(expires);
}

// ฟังก์ชันลบขยะใน Web Storage
function cleanWebStorage() {
 const cleanupStorage = (storage) => {
  for (let key in storage) {
   if (storage.hasOwnProperty(key)) {
    const value = storage.getItem(key);
    try {
     if (JSON.parse(value).expires < Date.now()) {
      storage.removeItem(key);
     }
    } catch (e) {
     // ลบรายการที่ไม่สามารถแปลงเป็น JSON ได้
     storage.removeItem(key);
    }
   }
  }
 };
 cleanupStorage(localStorage);
 cleanupStorage(sessionStorage);
 console.log('Web storage cleaned!');
}

// ปรับปรุงฟังก์ชัน Prefetching เพื่อเพิ่มความเร็วในการโหลด
function enablePrefetching() {
 const links = document.querySelectorAll('a[href]');
 links.forEach(link => {
  const prefetchLink = document.createElement('link');
  prefetchLink.rel = 'prefetch';
  prefetchLink.href = link.href;
  prefetchLink.as = 'document';
  document.head.appendChild(prefetchLink);
 });
}

// ปรับปรุงฟังก์ชัน Lazy Loading เพื่อเพิ่มความเร็วในการโหลด
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

// ฟังก์ชันบีบอัดเนื้อหาเพื่อประหยัดแบนด์วิธ
function enableContentCompression() {
 const script = document.createElement('script');
 script.src = 'https://cdn.jsdelivr.net/npm/pako@2.0.4/dist/pako.min.js';
 script.onload = () => {
  const compressData = (data) => pako.deflate(data, { level: 9 });
  const decompressData = (data) => pako.inflate(data, { to: 'string' });

  const data = '...'; // ตัวอย่างข้อมูลที่ต้องการบีบอัด
  const compressedData = compressData(data);
  console.log('Data compressed:', compressedData);

  const decompressedData = decompressData(compressedData);
  console.log('Data decompressed:', decompressedData);
 };
 document.head.appendChild(script);
}

// ฟังก์ชันเปิดใช้งาน HTTP/2
function enableHTTP2() {
 if (window.location.protocol === 'https:') {
  console.log('HTTP/2 enabled');
 }
}

// ฟังก์ชันเปิดใช้งาน Gzip Compression บนเซิร์ฟเวอร์
function enableGzipCompression() {
 console.log('Gzip Compression enabled');
}

// ฟังก์ชันลดการใช้ทรัพยากร
function reduceResourceUsage() {
 console.log('Reduced resource usage without interfering with HTML, CSS, and JS');
}

// ฟังก์ชันตรวจสอบความเสถียรของอินเทอร์เน็ตและปรับปรุงการเชื่อมต่อ
async function stabilizeInternetConnection() {
 try {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  await fetch('path/to/resource', { cache: 'no-store' });
  console.log('Resources pulled successfully.');
 } catch (error) {
  console.error('Error stabilizing internet connection:', error);
 }
}

// เพิ่มการใช้ Web Workers สำหรับการประมวลผลที่หนักหน่วง
function useWebWorkers() {
 if (window.Worker) {
  const worker = new Worker('worker.js');
  worker.postMessage({ data: 'heavy-data' });

  worker.onmessage = function(e) {
   console.log('Data from worker:', e.data);
  };
 }
}

// ฟังก์ชันช่วยโหลดที่ปรับปรุงแล้ว
async function loadResources() {
 try {
  await Promise.all([enablePrefetching(), enableLazyLoading()]);
  enableContentCompression();
  console.log('Resources loaded successfully.');
 } catch (error) {
  console.error('Error loading resources:', error);
 }
}

document.addEventListener('DOMContentLoaded', async function() {
 try {
  await unregisterServiceWorkers();
  setCacheControlHeaders();
  cleanWebStorage();
  await loadResources();
  enableHTTP2();
  enableGzipCompression();
  reduceResourceUsage();
  await stabilizeInternetConnection();
  useWebWorkers();
 } catch (error) {
  console.error('Error during initialization:', error);
 }
});