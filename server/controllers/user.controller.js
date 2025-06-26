const { pool } = require("../utils/db");

async function updateUserAsOnline( userId )
{
    pool.query("UPDATE user SET online_status = 'YES' WHERE id = ?" , [ userId ] )
    return {
        success:true
    }
}

async function updateUserAsOffline( userId )
{
    pool.query("UPDATE user SET online_status = 'YES' WHERE id = ?" , [ userId ] )
    return {
        success:true
    }
}

async function updateProfile( userId , form )
{
    try{
        
    }catch(err){
        return {
            success:false,
            error:err.message
        }
    }
}

module.exports = { updateUserAsOffline , updateUserAsOnline };