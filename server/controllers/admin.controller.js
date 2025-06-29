const  pool  = require("../utils/db")
const webPush = require("../utils/webpush");

async function notifyUserBySNS( userId , message ){
    try{
        const [ subs ] = await pool.query("SELECT sns_subscriptions FROM user WHERE id = ?" , [ userId ] )
        // console.log(subs)

        let success_cnt = 0,failed=0,successSNS=[];

        if(subs[0] && subs[0].sns_subscriptions ){
            for(const sub of JSON.parse( subs[0].sns_subscriptions ) ){
                console.log(sub);

                try{
                    const status = await webPush.sendNotification( sub , message )
                    console.log(status);
                    
                    success_cnt += 1;
                    successSNS.push( sub )
                }catch(err){
                    failed += 1;
                }   
            }
        }

        await pool.query("UPDATE user SET sns_subscriptions = ? WHERE id = ?" , [ JSON.stringify(successSNS) , userId ] )

        return{
            success:true,
            success_cnt:success_cnt,
            failed:failed,
            successSNS:successSNS
        }

    }catch(err){
        console.log(err)
        return {
            success:false,
            error:err.message
        }
    }
}

module.exports = { notifyUserBySNS }