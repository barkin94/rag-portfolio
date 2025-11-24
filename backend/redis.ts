import { AIMessage, HumanMessage } from "langchain";
import { createClient } from "redis"

import Config from "./config";

const { redis } = Config;

export type RedisMessage = {
  type: HumanMessage["type"] | AIMessage["type"]
  content: string
}

const MESSAGES_HGET_KEY = 'messages';


if (!redis.url) {
  throw new Error("REDIS_URL not found");
}

const client = createClient({
  url: redis.url
});

client.on("error", function(err) {
  throw err;
});
await client.connect()

const getMessages = async (threadID: string): Promise<RedisMessage[]> => {
  const messagesValueStr = await client.HGET(threadID, MESSAGES_HGET_KEY);

  const persistedMessages: RedisMessage[] = JSON.parse(
    messagesValueStr ?? '[]'
  );

  return persistedMessages;
}

const storeMessages = (sessionID: string, messages: RedisMessage[]) => {
   return client.multi()
          .HSET(sessionID, MESSAGES_HGET_KEY, JSON.stringify(messages))
          .EXPIRE(sessionID, redis.messagesTTLSeconds)
          .exec();
}

export default { getMessages, storeMessages };
