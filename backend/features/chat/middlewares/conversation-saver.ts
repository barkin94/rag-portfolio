import { createMiddleware } from "langchain";

import { stateSchema } from "../state-schema";
import { persistMessages } from '@/backend/shared/mongodb';

export default createMiddleware({
    name: 'MongoDBConversationSaver',
    stateSchema,
    afterAgent: async (state) => {
      await persistMessages([
        { role: 'user', content: state.messages.at(state.nextHumanMessageIndex)!.content as string },
        { role: 'assistant', content: state.messages.at(-1)!.content as string },
      ], state.threadId)

      return {
        ...state,
        nextHumanMessageIndex: state.messages.length
      }
    }
  })