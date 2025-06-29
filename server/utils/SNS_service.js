const pool = require("./db");
const { SNS_logger, logger } = require("./logger");
const webPush = require("./webpush");

async function SNS_service( receiver, message, sender ,ip )
{
    console.log(`SNS service called : ${receiver} received ${message} from ${sender}`);
    const [subscription] = await pool.query("SELECT sns_subscriptions FROM user WHERE id = ?" , [ receiver ] )

    console.log( subscription )

    if(subscription[0]?.sns_subscriptions){ 
        
        SNS_logger( { receiver , sender , message , time: new Date() , ip , subscription:subscription[0].sns_subscriptions , payload:"" } )
    }else{
        SNS_logger( { receiver , sender , message , time: new Date() , ip , subscription:"" , payload:"" } )
    }
}

async function SNS_message_service(receiver, message, sender, ip) {
  try {
    console.log(`SNS messaging service called: ${receiver} received ${JSON.stringify(message)} from ${sender}`);

    // Add await to database queries since pool is already promisified
    const [subscriptionRes] = await pool.query(
      "SELECT sns_subscriptions FROM user WHERE id = ?",
      [receiver]
    );
    const [usernameRes] = await pool.query(
      "SELECT username FROM user WHERE id = ?",
      [sender]
    );

    console.log(subscriptionRes, usernameRes);

 
    const rawSubscriptions = subscriptionRes[0]?.sns_subscriptions;

    if (rawSubscriptions) {
      let subscriptions = JSON.parse(rawSubscriptions);

      const payload = JSON.stringify({
        title: usernameRes[0].username,
        message: message.value ,
      });

      // Track successful and failed pushes
      let successCount = 0;
      let failureCount = 0;
      let successSubscriptions = [];

      for (const sub of subscriptions) {
        try {
          const result = await webPush.sendNotification(sub, payload);
          console.warn(result);
          
          successCount++;
          successSubscriptions.push(sub);
        } catch (err) {
          console.error(`❌ WebPush failed for ${sub.endpoint}`, err.message);
          failureCount++;
        }
      }

      await pool.query("UPDATE user SET sns_subscriptions = ? WHERE id = ?" , [ JSON.stringify(successSubscriptions) , receiver  ] )

      console.log(`Push notifications sent: ${successCount} successful, ${failureCount} failed`);
      

    } else {
      console.log(`No subscriptions found for user ${receiver}`);
    }
  } catch (err) {
    console.error('SNS message service error:', err);
    
  }
}


module.exports = { SNS_service , SNS_message_service }