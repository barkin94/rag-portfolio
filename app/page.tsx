'use client';

import { useCallback, useReducer } from "react";
import { Input } from "./components/input";
import { ChatHistory, Message } from "./components/chat-history";

type ChatState = {
  messages: Message[];
  streamingMessage: {
    loading: boolean;
    content: string;
  }
}

type ChatAction =
  | { type: 'START_RESPONSE' }
  | { type: 'CHUNK_RETRIEVED'; payload: string }
  | { type: 'DONE_RETRIEVING' }
  | { type: 'SEND_MESSAGE'; payload: string };


function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'START_RESPONSE':
      return {
        ...state,
        streamingMessage: {
          ...state.streamingMessage,
          content: ''
        },
      };

    case 'CHUNK_RETRIEVED':
      return {
        ...state,
        streamingMessage: {
          content: state.streamingMessage.content + action.payload,
          loading: false
        },
      };

    case 'DONE_RETRIEVING':
      return {
        ...state,
        messages: [
          ...state.messages,
          { content: state.streamingMessage.content, owner: 'ai' },
        ],
        streamingMessage: {
          ...state.streamingMessage,
          content: ''
        },
      };

    case 'SEND_MESSAGE':
      return {
        ...state,
        streamingMessage: {
          ...state.streamingMessage,
          loading: true,
        },
        messages: [
          ...state.messages,
          { content: action.payload, owner: 'user' },
        ],
      };

    default:
      throw new Error(`Unknown action: ${action}`);
  }
}

export default function Home() {
  const [state, dispatch] = useReducer(chatReducer, {
    messages: [],
    streamingMessage: {
      content: '',
      loading: false
    },
  });

  const handleSendClicked = useCallback((input: string) => {
    dispatch({ type: 'SEND_MESSAGE', payload: input });
  }, []);

  const handleResponse = useCallback(() => {
    dispatch({ type: 'START_RESPONSE' });
  }, []);

  const handleResponseChunkRetrieved = useCallback((chunk: string) => {
    dispatch({ type: 'CHUNK_RETRIEVED', payload: chunk });
  }, []);

  const handleResponseChunkRetrievalDone = useCallback(() => {
    dispatch({ type: 'DONE_RETRIEVING' });
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center py-32 px-16 bg-white dark:bg-black sm:items-start">
        <ChatHistory
          initialMessages={state.messages}
          streamedMessage={state.streamingMessage.content}
          loading={state.streamingMessage.loading}
          />
        <Input
          onSendClicked={handleSendClicked}
          onResponse={handleResponse}
          onResponseChunkRetrieved={handleResponseChunkRetrieved}
          onResponseChunkRetrievalDone={handleResponseChunkRetrievalDone}
          />
      </main>
    </div>
  );
}
