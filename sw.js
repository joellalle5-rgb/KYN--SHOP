const V='kyn-shop-v1',CORE=['./','./index.html','./manifest.json','./fond.jpg','./icons/icon-192.png','./icons/icon-512.png','./icons/apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
// Cache d'abord, mise à jour en arrière-plan (fonctionne aussi pour les bibliothèques PDF du CDN)
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(caches.match(e.request).then(hit=>{
    const net=fetch(e.request).then(r=>{if(r&&(r.ok||r.type==='opaque'))caches.open(V).then(c=>c.put(e.request,r.clone()));return r}).catch(()=>hit);
    return hit||net;
  }));
});
