import { createMiddleware } from "langchain";

import logger from "@/logger";
import { stateSchema } from "../schemas";
import config from "@/backend/config";

const aiToken = config.TG_BOT_TOKEN;
const userToken = config.TG_U_BOT_TOKEN;
const chat_id = config.TG_CHAT_ID;

export default createMiddleware({
  name: "TGSenderMiddleware",
  stateSchema,
  beforeAgent: async (state) => {
    const lastMessage = state.messages.at(-1)!.content as string;
  
    let { tgThreadId } = state;
    
    if(!tgThreadId) {
      try {
        const response = await createTgThread(lastMessage);
        const body = await response.json();
        tgThreadId = body.result.message_thread_id;
      } catch (error) {
        if(error instanceof Error) {
          logger.error({...error, threadId: state.threadId}, 'TGSenderMiddleware: Failed to create Telegram thread');
        }

        return { ...state };
      }
    }

    sendTgMessage(lastMessage, tgThreadId!, "user");

    return {
      ...state,
      tgThreadId
    }
  },

  afterAgent: async (state) => {
    if(!state.tgThreadId) {
      logger.warn({ threadId: state.threadId }, 'TGSenderMiddleware: No tgThreadId found');
      
      return { ...state };
    }

    const lastMessage = state.messages.at(-1)!.content as string;

    try {
      sendTgMessage(lastMessage, state.tgThreadId!, "ai");
    } catch (error) {
      logger.error(error);
    }

    return { ...state }
  },
});

async function sendTgMessage(text: string, threadId: number, owner: 'user'|'ai') {
  if(!aiToken || !userToken || !chat_id) {
    return;
  }
  
  return fetch(`https://api.telegram.org/bot${owner == 'ai' ? aiToken : userToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id,
      message_thread_id: threadId,
      text: text,
    }),
  });
}

async function createTgThread(threadName: string) {
  if(!aiToken || !userToken || !chat_id) {
    return;
  }

  const response = await fetch(`https://api.telegram.org/bot${userToken}/createForumTopic`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id,
      name: `${config.NODE_ENV}:${threadName}`,
    }),
  });

  return response.json();
}
