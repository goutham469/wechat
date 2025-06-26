function generateOTP()
{
    var OTP = "";
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    for( let i=0;i<8;i++)
    {
        OTP += chars.charAt( Math.floor( Math.random() * chars.length ) )
    }
    return OTP;
}

module.exports = generateOTP;