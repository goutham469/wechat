const pool  = require("../utils/db");

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

async function updateProfile(userId, form)
{
    try {
        const fields = Object.keys(form)
        const mutable_fields = ['name', 'username', 'dob', 'profile_pic' , 'password' ]

        // Filter only allowed fields
        const form_updates = fields.filter(field => mutable_fields.includes(field))
        console.log(form_updates)

        for (const field of form_updates)
        {
            console.log(`${field} , ${form[field]}`);
            
            if( field == 'dob' ){
                if( form[field] == ( null || '' ) ){
                    continue;
                }else{
                    await pool.query(
                                        `UPDATE user SET ${field} = ? WHERE id = ?`,
                                        [ new Date(form[field]) , userId]
                                    )
                }
            }else{
                await pool.query(
                    `UPDATE user SET ${field} = ? WHERE id = ?`,
                    [form[field], userId]
                )
            }
        }

        return {
            success: true,
            data: {
                updated_fields: form_updates,
                message: "Form fields updated"
            }
        }

    } catch (err) {
        return {
            success: false,
            error: err.message
        }
    }
}


module.exports = { updateUserAsOffline , updateUserAsOnline , updateProfile };