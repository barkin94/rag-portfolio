import { Chat } from "./_components/Chat/Chat";
import { Profile } from "./_components/Profile";

import messageMapper from "@/backend/message-mapper";
import redis from "@/backend/redis";
import utils from "@/backend/utils";
import { Message } from "./_components/Chat/Messages";

export default async function Home() {
  const initialMessages: Message[] = []

  const userId = await utils.getUserIdFromCookie();
  
  if(userId) {
    initialMessages.push(
      ...messageMapper.redisToLangchain(
        await redis.getMessages(userId)
      ).map(m => ({ content: m.content as string, owner: m.type }))
    )
  }
 
  return (
    <div className="container mx-auto px-4 py-8">
      <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Profile />
        <Chat initialMessages={initialMessages}/>
      </main>
    </div>
  )
}
