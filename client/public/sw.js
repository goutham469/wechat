self.addEventListener("push", function (event) {
  const data = event.data.json();
  console.log("📩 Push Received", data);

  self.registration.showNotification(data.title, {
      body: data.message + '\n\n' + data?.task?.task,
      icon: "/vite.svg",
  });
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  const url = "https://wechat.iamgoutham.in";
  clients.openWindow(url);
});