import { AIMessage, HumanMessage } from "langchain"

export type Message = {
  type: 'ai' | 'human'
  content: string
}

const toLangchain = (messages: Message[]) =>
  messages.map(m => new (getMessageConstructor(m.type))(m.content))

const getMessageConstructor = (type: string) => {
  switch (type) {
    case 'ai': return AIMessage
    case 'human': return HumanMessage
    default: throw new Error('unknown message type')
  }
}

export default { toLangchain }