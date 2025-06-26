const { VITE_SERVER_URL , VITE_VAPID_PUBLIC_KEY } = import.meta.env; 

export const registerServiceWorker = async () => 
{
    if ("serviceWorker" in navigator) 
    {
        try 
        {
            const registration = await navigator.serviceWorker.register("/sw.js");
            console.log("✅ Service Worker Registered", registration);
            return registration;
        } 
        catch (error) 
        {
            console.error("❌ Service Worker Registration Failed", error);
        }
    }
};
    
export const requestNotificationPermission = async () => 
{
    const permission = await Notification.requestPermission();
    if (permission === "granted") 
    {
        console.log("✅ Notification permission granted");
        return true;
    }
    console.log("❌ Notification permission denied");
    return false;
};

export const subscribeToPush = async ( userId ) => 
{
    const registration = await navigator.serviceWorker.ready;
    
    const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array( VITE_VAPID_PUBLIC_KEY ),
    });

    // Send subscription data to backend
    let response = await fetch(`${VITE_SERVER_URL}/user/subscribe`, {
        method: "POST",
        body: JSON.stringify({ subscription:subscription , userId:userId}),
        headers: { "Content-Type": "application/json" },
    });

    response = await response.json()
    if(response.success){
        alert("Thanks for subscribing ...")
    }else{
        alert(`Your Subscription failed, due to ${response.error} ...`)
    }
    return subscription;
};

// Utility function to convert VAPID key
const urlBase64ToUint8Array = (base64String) => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, "+")
        .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
};
