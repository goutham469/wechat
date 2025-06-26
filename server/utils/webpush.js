import webPush from "web-push";
const { VAPID_PRIVATE_KEY , VAPID_PUBLIC_KEY , VAPID_EMAIL } = process.env;

webPush.setVapidDetails(
  VAPID_EMAIL,
  VAPID_PUBLIC_KEY ,
  VAPID_PRIVATE_KEY
);

export default webPush;