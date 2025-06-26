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
    const { receiver , sender , message , time , ip , subscription , payload } = obj;
    await pool.query("INSERT INTO sns_notification ( receiver , sender , message , time , ip , subscription , payload ) VALUES(?,?,?,?,?,?,?);" , [ receiver , sender , message , time , ip , subscription , payload ]);   
}

async function SNS_getLogs( obj )
{
    const [logs] = await pool.query("SELECT * FROM sns_notification ");
    console.log(logs);
    return logs;
}


module.exports = { logger , getLogs , email_logger , email_getLogs , SNS_logger , SNS_getLogs }; 