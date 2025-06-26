const { randomInt } = require("crypto")

function generatePassword()
{
    let password = "";
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789./?*-+";
    for(let i=0;i<20;i++)
    {
        password += chars[ Math.floor( Math.random() * chars.length ) ]
    }
    return password;
}

module.exports = generatePassword;