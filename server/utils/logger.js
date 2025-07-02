const pool = require("./db")

async function logger( obj )
{
    const { message , time , ip } = obj;
    await pool.query("INSERT INTO logs(message , time , ip) VALUES(?,?,?);" , [ message , time , ip ]);   
}

async function getLogs( obj )
{
    const [logs] = await pool.query("SELECT * FROM logs ");
    console.log(logs);
    return logs;
} 

async function email_logger( obj )
{
    const { sender , receiver , header , body ,  time } = obj;
    await pool.query("INSERT INTO logs( sender , receiver , header , body , time ) VALUES(?,?,?,?,?);" , [ sender , receiver , header , body ,  time ]);   
}
 
async function email_getLogs( obj )
{
    const [logs] = await pool.query("SELECT * FROM logs ");
    console.log(logs);
    return logs;
}

async function SNS_logger( obj )
{
    try{
        const { receiver , sender , message , time , ip , subscription , payload } = obj;
        console.error("new push log" , obj);
        await pool.query("INSERT INTO sns_notification ( receiver , sender , message , time , ip , subscription , payload ) VALUES(?,?,?,?,?,?,?);" , [ receiver , sender , message , time , ip , subscription , payload ]);  
    }catch(err){
        console.error(err)
    } 
}

async function SNS_getLogs(obj) {
  try {
    console.warn("new request came for push notifications list...", obj);

    if (obj.userId) {
      // return user push notifications
      const [notifications] = await pool.query(
        "SELECT * FROM sns_notification WHERE receiver = ? ORDER BY time DESC",
        [obj.userId]
      );

      return {
        success: true,
        data: {
          notifications,
          cnt:notifications.length
        },
      };
    }

    else if (typeof obj.page === "number") {
      // admin route return by pagination
      const [notifications] = await pool.query(
        "SELECT * FROM sns_notification ORDER BY time DESC LIMIT 30 OFFSET ?",
        [obj.page * 30]
      );
      return {
        success: true,
        data: {
          notifications,
        },
      };
    }
    
    else {
      return {
        success: false,
        error: "Invalid request",
      };
    }
  } catch (err) {
    return {
      success: false,
      error: err.message,
    };
  }
}



module.exports = { logger , getLogs , email_logger , email_getLogs , SNS_logger , SNS_getLogs }; 