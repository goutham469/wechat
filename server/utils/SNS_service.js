const pool = require("./db");
const { SNS_logger, logger } = require("./logger");
const { default: webPush } = require("./webpush");

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

    // Add validation for query results
    if (!subscriptionRes || subscriptionRes.length === 0) {
      console.log(`No user found with receiver ID: ${receiver}`);
      return;
    }

    if (!usernameRes || usernameRes.length === 0) {
      console.log(`No user found with sender ID: ${sender}`);
      return;
    }

    const rawSubscriptions = subscriptionRes[0]?.sns_subscriptions;

    if (rawSubscriptions) {
      let subscriptions;
      
      // Add JSON parsing error handling
      try {
        subscriptions = JSON.parse(rawSubscriptions);
      } catch (parseErr) {
        console.error(`Failed to parse subscriptions for user ${receiver}:`, parseErr.message);
        return;
      }

      // Validate subscriptions is an array
      if (!Array.isArray(subscriptions)) {
        console.error(`Subscriptions is not an array for user ${receiver}`);
        return;
      }

      const payload = JSON.stringify({
        title: usernameRes[0].username,
        message: message,
      });

      // Track successful and failed pushes
      let successCount = 0;
      let failureCount = 0;

      for (const sub of subscriptions) {
        try {
          await webPush.sendNotification(sub, payload);
          successCount++;
        } catch (err) {
          console.error(`❌ WebPush failed for ${sub.endpoint}`, err.message);
          failureCount++;
        }
      }

      console.log(`Push notifications sent: ${successCount} successful, ${failureCount} failed`);

    } else {
      console.log(`No subscriptions found for user ${receiver}`);
    }
  } catch (err) {
    console.error('SNS message service error:', err);
    logger({
      message: `SNS message service error for receiver: ${receiver}, sender: ${sender}. Error: ${err.message}`,
      time: new Date(),
      ip,
      stack: err.stack
    });
  }
}


module.exports = { SNS_service , SNS_message_service }