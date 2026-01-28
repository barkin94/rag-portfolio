import { createMiddleware } from "langchain";

import { stateSchema } from "../schemas";
import Mongodb from "@/backend/mongodb";

export default createMiddleware({
    name: 'MongoDBConversationSaver',
    stateSchema,
    afterAgent: async (state) => {
      await Mongodb.persistMessages([
        { role: 'user', content: state.messages.at(state.nextHumanMessageIndex)!.content as string },
        { role: 'assistant', content: state.messages.at(-1)!.content as string },
      ], state.threadId)

      return {
        ...state,
        nextHumanMessageIndex: state.messages.length
      }
    }
  })