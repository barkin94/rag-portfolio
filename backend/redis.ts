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

client.on("error", function (err) {
  throw err;
});
await client.connect()

const getMessages = async (userId: string): Promise<RedisMessage[]> => {
  const [messagesResult] =
    await client.multi()
      .HGET(userId, MESSAGES_HGET_KEY)
      .EXPIRE(userId, redis.messagesTTLSeconds)
      .execAsPipelineTyped()

  const persistedMessages: RedisMessage[] = JSON.parse(messagesResult ?? '[]');

  return persistedMessages;
}

const storeMessages = (userId: string, messages: RedisMessage[]) => {
  return client.multi()
    .HSET(userId, MESSAGES_HGET_KEY, JSON.stringify(messages))
    .EXPIRE(userId, redis.messagesTTLSeconds)
    .execAsPipeline();
}

export default { getMessages, storeMessages };
