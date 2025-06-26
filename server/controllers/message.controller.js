const pool = require("../utils/db")

async function insertMessage( chatId , sender , message )
{
    console.log(chatId)
    await pool.query("INSERT INTO messages( chat_id , sent_by , message_type , message_value ) VALUES(?,?,?,?);" , [ chatId , sender , message.message_type , message.message_value  ] )
    const msg_obj = {
        message_type : message.message_type , 
        message_value : message.message_value ,
        sent_by : sender ,
        sent_time : new Date()
    }
    await pool.query("UPDATE chats SET last_message = ? WHERE chat_id = ? ;" , [ JSON.stringify( msg_obj ) , chatId ] )
    return {
        success:true
    }
}



module.exports = { insertMessage }