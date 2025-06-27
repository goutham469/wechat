const  pool  = require("../utils/db")
// const { default: webPush } = require("./webpush");

// async function notifyUserBySNS( userId , message ){
//     try{
//         const [ subs ] = await pool.query("SELECT sns_subscriptions FROM user WHERE id = ?" , [ userId ] )

//         if(subs[0] && subs[0].sns_subscriptions ){
//             for(const sub of subs[0].sns_subscriptions ){
//                 await webPush
//             }
//         }

//     }catch(err){
//         return {
//             success:false,
//             error:err.message
//         }
//     }
// }