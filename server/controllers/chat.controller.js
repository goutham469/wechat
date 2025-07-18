const pool = require("../utils/db");
const { logger } = require("../utils/logger");
const { getChatId } = require("../utils/tools")

async function checkChatInstanceExistence( from , to )
{
    let a = Math.min( from , to ) , b = Math.max( from , to );

    const [ chats ] = await pool.query("SELECT * FROM chats WHERE user_id_1 = ? AND user_id_2 = ?" , [ a , b ] );

    if( chats.length > 0 ){
        return true;
    }
    return false;
}

async function createChatInstance( user_ids )
{
    // user_ids is an array if user(id)
    if( await checkChatInstanceExistence( user_ids[0] , user_ids[1] ) ){
        return {
            success:false,
            error:"Chat already exists."
        }
    }else{
        await pool.query("INSERT INTO chats( user_id_1 , user_id_2 ) VALUES( ? , ? );" , [ Math.min( user_ids[0] , user_ids[1] ) , Math.max( user_ids[0] , user_ids[1] )  ] )
        return {
            success:true
        }
    }
}

async function getUserChats( userId )
{
    try{
        const [ chats1 ] = await pool.query("SELECT chats.chat_id , chats.last_message , chats.user_id_2 as receiver , user.username , user.profile_pic , user.online_status   FROM chats INNER JOIN user ON user.id = chats.user_id_2 WHERE chats.user_id_1 = ? ;" , [ userId ] )
        const [ chats2 ] = await pool.query("SELECT chats.chat_id , chats.last_message , chats.user_id_1 as receiver , user.username , user.profile_pic , user.online_status   FROM chats INNER JOIN user ON user.id = user_id_1 WHERE chats.user_id_2 = ? ;" , [ userId ] )
        // here chats1 , chats2 are arrays
        return [ ...chats1 , ...chats2 ] ;
    }catch(err){
        return {
            success:false,
            error:err.message
        }
    }
}

async function getChatMessagesWithOtherUser( u1 , u2 )
{
    let chatId = tools.getChatId( u1 , u2 );
    const [ messages ] = await pool.query("SELECT * FROM messages WHERE user_id_1 = ? AND user_id_2 = ?;" , [ chatId[0] , chatId[1] ] )
    logger( { message:`Controller getChatMessagesWithOtherUser(${u1},${u2}) , u1=${u1} u2=${u2} ` , time:new Date() , ip : req.ip } )
    return messages
}

async function getChatMessagesWithOtherUserByPagination( u1 , u2 , page = 0) {
    try{
        const limit = 50;
        const offset = limit * page;
        const chatId = getChatId( u1 , u2 )

        const [messages] = await pool.query(
            "SELECT * FROM messages WHERE user_id_1 = ? AND user_id_2 = ? ORDER BY sent_time DESC LIMIT ? OFFSET ?",
            [ chatId[0] , chatId[1] , limit, offset]
        );
        logger( { message: `getChatMessagesWithOtherUserByPagination( u1:${u1} , u2:${u2} , page:${page}) ` , time:new Date() , ip : req.ip } )

        return messages;
    }catch(err){
        return {
            success:false, 
            error:err.message
        }
    }
}

async function getChatMessagesByChatIdByPagination( chatId , page = 0) {
    try{
        const limit = 50;
        const offset = limit * page;

        // const [messages] = await pool.query(
        //     "SELECT * FROM messages WHERE chat_id = ? ORDER BY sent_time DESC LIMIT ? OFFSET ?",
        //     [ chatId , limit, offset]
        // );
        const [messages] = await pool.query(
            "SELECT * FROM messages WHERE chat_id = ? ORDER BY sent_time ASC",
            [ chatId ]
        );
    
        return messages;
    }catch(err){
        return {
            success:false, 
            error:err.message
        }
    }
}

module.exports = { checkChatInstanceExistence , createChatInstance , getUserChats , getChatMessagesWithOtherUser , getChatMessagesWithOtherUserByPagination , getChatMessagesByChatIdByPagination }