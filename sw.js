const V='kyn-shop-v4',CORE=['./','./index.html','./manifest.json','./fond.jpg','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];
// Installation tolérante : un fichier manquant ne bloque plus le service worker
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>Promise.all(CORE.map(u=>c.add(u).catch(()=>{})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
const put=(r,x)=>{if(x&&(x.ok||x.type==='opaque')){const c=x.clone();caches.open(V).then(k=>k.put(r,c))}return x};
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  if(new URL(r.url).origin===location.origin){
    // Fichiers de l'appli : réseau d'abord (mises à jour immédiates), cache si hors connexion
    e.respondWith(fetch(r).then(x=>put(r,x)).catch(()=>caches.match(r).then(x=>x||(r.mode==='navigate'?caches.match('./index.html'):Response.error()))));
  }else{
    // Bibliothèques externes (PDF) : cache d'abord
    e.respondWith(caches.match(r).then(h=>h||fetch(r).then(x=>put(r,x))));
  }
});
