/// <reference lib="webworker" />
/// <reference no-default-lib="true"/>

// Injection point for the Workbox precache manifest
self.__WB_MANIFEST;

self.addEventListener("push", function (event) {
    try {
        if (!event.data) {
            console.log("Push event received but no data");
            return;
        }

        const data = event.data.json();

        const options = {
            body: data.body,
            title: data.title,
            icon: "/admin/pwa-192x192.png",
            badge: "/admin/pwa-192x192.png",
            vibrate: [100, 50, 100],
            data: {
                url: data.link || "/admin/",
                dateOfArrival: Date.now(),
                primaryKey: "1",
            },
            actions: [
                {
                    action: "open_link",
                    title: "Open Link",
                    icon: "/admin/pwa-192x192.png",
                },
                {
                    action: "close",
                    title: "Close",
                    icon: "/admin/pwa-192x192.png",
                },
            ],
            requireInteraction: true,
        };

        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    } catch (err) {
        console.error("Error showing notification:", err);
    }
});

self.addEventListener("notificationclick", function (event) {
    event.notification.close();

    const data = event.notification.data;
    if (!data || !data.url) return;

    if (!event.action) {
        event.waitUntil(
            clients.matchAll({ type: "window" }).then(function (clientList) {
                // If a tab matching the URL is already open, focus it
                for (const client of clientList) {
                    if (client.url === data.url && "focus" in client) {
                        return client.focus();
                    }
                }
                // If no tab is open, open a new one
                return clients.openWindow(data.url);
            })
        );
        return;
    }

    switch (event.action) {
        case "open_link":
            event.waitUntil(clients.openWindow(data.url));
            break;
        case "close":
            // Just close the notification (already done above)
            break;
    }
});
