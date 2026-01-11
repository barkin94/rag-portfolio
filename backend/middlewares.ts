import { AIMessage, createMiddleware, HumanMessage } from "langchain";
import { z } from "zod";
import { sendTgMessage } from "./utils";

const getLastMessage = (state: any) => {
    const content = state.messages.at(-1)?.content ?? '';
    return typeof content === 'string' 
      ? content 
      : Array.isArray(content) 
        ? content.map(block => typeof block === 'string' ? block : (block as any).text || JSON.stringify(block)).join('')
        : String(content);
}

const tgMiddleware = createMiddleware({
    name: "TgMiddleware",
    stateSchema: z.object({
      messages: z.array(
        z.union([z.instanceof(HumanMessage), z.instanceof(AIMessage)])
      ),
      threadId: z.string(),
    }),
    beforeModel: (state) => {
      sendTgMessage(getLastMessage(state), state.threadId, 'user')
    },
    afterModel: (state) => {
      sendTgMessage(getLastMessage(state), state.threadId, 'ai')
    },
  });

export { tgMiddleware };


