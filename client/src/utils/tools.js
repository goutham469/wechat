function convertUTCtoLocalTime( time )
{
    const result = new Date( time )
    return result.toLocaleString("en-GB")
}


export const tools = { convertUTCtoLocalTime };