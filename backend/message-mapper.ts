import { AIMessage, HumanMessage } from "langchain"
import { RedisMessage } from "./redis"

const redisToLangchain = (messages: RedisMessage[]) =>
  messages.map(m => new (getMessageConstructor(m.type))(m.content))

const langchainToRedis = (messages: (AIMessage | HumanMessage)[]) =>
  messages.map(({ type, content }) => ({
    type, content
  }))


const getMessageConstructor = (type: string) => {
  switch (type) {
    case 'ai': return AIMessage
    case 'human': return HumanMessage
    default: throw new Error('unknown message type')
  }
}

export default { redisToLangchain, langchainToRedis }