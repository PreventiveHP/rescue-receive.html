// sw.js - MontCode™ Service Worker
self.addEventListener('push', function(event) {
    const data = event.data ? event.data.json() : {};
    
    const options = {
        body: data.body || "⚠️ ALERTA DE EMERGENCIA: Se requiere asistencia inmediata.",
        icon: 'logo.png.jpg',
        badge: 'logo.png.jpg',
        vibrate: [500, 110, 500, 110, 450, 110, 200, 110, 170, 40, 450, 110, 200, 110, 170, 40],
        data: {
            url: self.registration.scope
        },
        actions: [
            { action: 'open', title: 'VER UBICACIÓN 📍' }
        ],
        tag: 'emergency-alert', // Evita múltiples notificaciones, las agrupa
        renotify: true,
        requireInteraction: true // La notificación no desaparece hasta que la toquen
    };

    event.waitUntil(
        self.registration.showNotification(data.title || "MontCode™ Rescue", options)
    );
});

// Al hacer clic en la notificación, abre la app
self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data.url)
    );
});
