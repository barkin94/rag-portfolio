import utils from "@/backend/utils";
import redis from "@/backend/redis";

export async function POST(request: Request) {
    let userId = await utils.getUserIdFromCookie()
    
    if(userId) {
        redis.resetMessages(userId)
    }
    
    return new Response(null, { status: 202 });
}