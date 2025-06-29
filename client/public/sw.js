self.addEventListener("push", function (event) {
  const data = event.data.json();
  console.log("📩 Push Received", data);

  const options = {
    body: data.message,
    icon: "/icons/notification-icon.png", // use a 192x192 image
    badge: "/icons/badge-icon.png",       // 72x72 for status bar icon (on Android)
    image: data.image || undefined,       // Optional large image preview
    vibrate: [200, 100, 200],
    tag: "wechat-notification",           // avoid duplicate stacking
    renotify: true,
    data: {
      url: data.url || "https://wechat.iamgoutham.in", // fallback url
    },
    actions: [
      {
        action: "open_chat",
        title: "💬 Open Chat",
        icon: "/icons/chat-icon.png",
      },
      {
        action: "dismiss",
        title: "❌ Dismiss",
        icon: "/icons/close-icon.png",
      },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(data.title || "📨 New Message", options)
  );
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  const action = event.action;
  const targetUrl = event.notification.data.url;

  if (action === "open_chat") {
    event.waitUntil(clients.openWindow(targetUrl));
  } else if (action === "dismiss") {
    // do nothing or log analytics
  } else {
    // default click (outside buttons)
    event.waitUntil(clients.openWindow(targetUrl));
  }
});
