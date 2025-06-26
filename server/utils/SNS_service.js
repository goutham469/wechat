const { pool } = require("./db");
const { SNS_logger } = require("./logger");

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

module.exports = { SNS_service }