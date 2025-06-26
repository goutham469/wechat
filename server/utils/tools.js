function getChatId( u1 , u2 )
{
    return [ Math.min( u1 , u2 )  , Math.max( u1 , u2 ) ]
}

function convertUTCtoLocalTime( time )
{
    const result = new Date( time )
    return result.toLocaleString()
}

module.exports = { getChatId , convertUTCtoLocalTime };