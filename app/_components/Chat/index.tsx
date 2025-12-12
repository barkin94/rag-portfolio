'use client';

import React, { useCallback, useReducer } from "react";
import Input from "./Input";
import Messages, { Message } from "./Messages";

type ChatState = {
  isOpen: boolean;
  messages: Message[];
  streamingMessage: {
    loading: boolean;
    content: string;
  }
}

type ChatAction =
  | { type: 'OPEN_CHAT' }
  | { type: 'CLOSE_CHAT' }
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
          loading: false,
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
    
      case 'OPEN_CHAT':
        return {
          ...state,
          isOpen: true,
        };

      case 'CLOSE_CHAT':
        return {
          ...state,
          isOpen: false
        };

    default:
      throw new Error(`Unknown action: ${action}`);
  }
}

const Chat: React.FC<{ initialMessages: Message[] }> = ({ initialMessages = [] }) => {
  const [state, dispatch] = useReducer(chatReducer, {
    messages: initialMessages,
    streamingMessage: {
      content: '',
      loading: false
    },
    isOpen: false,
  });

  const handleChatIconClicked = () => {
    dispatch({ type: 'OPEN_CHAT' });
  }

  const handleChatWindowCloseClicked = () => {
    dispatch({ type: 'CLOSE_CHAT' });
  }

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

  const chatHeightClass = state.isOpen ? 'h-9/10 lg:h-3/5 border' : 'h-0';

  return (
    <>
      <button
        onClick={handleChatIconClicked}
        className="animate-bounce fixed text-5xl p-5 bottom-6 right-6 z-50 bg-linear-to-br from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 hover:scale-110 shadow-md hover:shadow-lg rounded-full w-20 h-20 flex items-center justify-center focus:outline-none">
          💬
      </button>

      <section
        className={`flex flex-col z-50 transition-[height] ease-in-out duration-1000 ${chatHeightClass} fixed bottom-0 right-0 lg:right-4 w-full lg:w-3/4 xl:w-2/5 bg-linear-to-br from-white via-indigo-50/30 to-purple-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 rounded-3xl shadow-xl border-slate-200 dark:border-slate-800 overflow-hidden`}
        aria-label="Chat interface"
      >
        <div className="p-4 flex border-b border-slate-800">
          <button
            onClick={handleChatWindowCloseClicked}
            className="mr-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full w-8 h-8 flex items-center justify-center shadow focus:outline-none"
            aria-label="Close chat"
          >
            x
          </button>

          <button
            onClick={handleChatWindowCloseClicked}
            className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full w-8 h-8 flex items-center justify-center shadow focus:outline-none"
            aria-label="Close chat"
          >
            ↺
          </button>
        </div>

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
      </section>
    </>
  );
}

export default Chat;
