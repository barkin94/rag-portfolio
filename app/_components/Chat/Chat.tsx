'use client';

import React, { useCallback, useReducer } from "react";
import { Input } from "./Input";
import { Messages, Message } from "./Messages";

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
          { content: action.payload, owner: 'human' },
        ],
      };

    default:
      throw new Error(`Unknown action: ${action}`);
  }
}


export const Chat: React.FC<{ initialMessages: Message[] }> = ({ initialMessages = [] }) => {
  const [state, dispatch] = useReducer(chatReducer, {
    messages: initialMessages,
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
    <section 
      className="flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 font-sans rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 mb-12 overflow-hidden"
      aria-label="Chat interface"
    >
      <div className="flex w-full flex-col items-center bg-white dark:bg-slate-900 sm:items-start rounded-2xl h-full">
        <Messages
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
      </div>
    </section>
  );
}
