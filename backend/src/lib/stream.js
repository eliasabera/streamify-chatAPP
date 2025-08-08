import { StreamChat } from 'stream-chat'
import 'dotenv/config'

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if (!apiKey || !apiSecret) { console.error("stream apikey or apisecret missing") };


const streamClient = StreamChat.getInstance(apiKey, apiSecret);

export const upsertStreamUser = async (userdata) => {
    try {
        await streamClient.upsertUsers([userdata])
        return userdata
    }
    catch (e) {
        console.error("upsertUser faild",e)
    }
}

export const generateStreamToken=(userId)=>{}