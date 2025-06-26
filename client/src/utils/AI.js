import { GoogleGenAI } from '@google/genai';


const GOOGLE_GEN_AI_API_KEY = "AIzaSyAkJNyzl0m2fcr2XZu4ch_RxYw3lnFaPfA";

const ai = new GoogleGenAI({ apiKey:GOOGLE_GEN_AI_API_KEY })

async function generate_username( email , name )
{
    const response = await ai.models.generateContent({
        model:"gemini-2.0-flash",
        contents:`You are a model to generate a username for a social media account registration process.
        Here is the user's email=${email} , name=${name} , and add 2 random characters to uniquely identify the user and it should be as small as possible ,
         make sure you give these usernames in a JSON format . Note you have to generate 5 different usernames , in faormatting just give me an array any json comments are not needed`
    })

    console.log(response.candidates[0].content.parts[0].text)
    return response.candidates[0].content.parts[0].text ;
}


export const AI = { generate_username }