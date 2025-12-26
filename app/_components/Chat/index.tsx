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
  | { type: 'RESET_CHAT' }
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

      case 'RESET_CHAT':
        return {
          ...state,
          messages: [],
          streamingMessage: {
            content: '',
            loading: false
          }
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

  const handleChatCloseClicked = () => {
    dispatch({ type: 'CLOSE_CHAT' });
  }

  const handleChatResetClicked = () => {
    dispatch({ type: 'RESET_CHAT' });
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

  const chatHeightClass = state.isOpen ? 'h-9/10 lg:h-4/5' : 'h-0';

  return (
    <>
      <button
        onClick={handleChatIconClicked}
        className="animate-bounce fixed text-5xl p-5 bottom-6 right-6 z-50 bg-background text-foreground transition-all duration-300 hover:scale-110 shadow-2xl hover:shadow-lg rounded-full w-20 h-20 flex items-center justify-center focus:outline-none">
          🤖
      </button>

      <section
        className={`flex flex-col z-50 transition-[height] ease-in-out duration-1000 ${chatHeightClass} fixed bottom-0 right-0 lg:right-4 w-full lg:w-3/4 xl:w-2/5 bg-background rounded-3xl shadow-2xl shadow-blue-700/30  border border-stone-200 dark:border-stone-800 overflow-hidden`}
        aria-label="Chat interface"
      >
        <div className="p-4 flex items-center border-b border-stone-200 dark:border-stone-800">
          <div className="grow">
            <h2 className="text-lg font-semibold text-foreground">Chat with me</h2>
            <p className="text-sm text-foreground">I am here to help you with your questions.</p>
          </div>
          <button
            onClick={handleChatCloseClicked}
            className="mr-2 bg-stone-200 hover:bg-stone-300 dark:bg-stone-800 dark:hover:bg-stone-700 text-foreground rounded-full w-8 h-8 flex items-center justify-center shadow focus:outline-none"
            aria-label="Close chat"
          >
            x
          </button>

          <button
            onClick={handleChatResetClicked}
            className="bg-stone-200 hover:bg-stone-300 dark:bg-stone-800 dark:hover:bg-stone-700 text-foreground rounded-full w-8 h-8 flex items-center justify-center shadow focus:outline-none"
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
