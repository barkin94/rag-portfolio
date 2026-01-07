'use client';

import React, { useCallback, useEffect, useReducer, useRef } from "react";
import { redirect, RedirectType } from 'next/navigation'

import Input from "./Input";
import Messages, { Message } from "./Messages";
import { LeftArrowIcon } from "@/app/_components/Icons";
import { useStreamingFetch } from "@/app/_hooks/useStreamingFetch";

type ChatState = {
  error: string | null;
  messages: Message[];
  streamingMessage: {
    loading: boolean;
    content: string;
  }
}

type ChatAction =
  | { type: 'RESET_CHAT' }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'START_RESPONSE' }
  | { type: 'CHUNK_RETRIEVED'; payload: string }
  | { type: 'DONE_RETRIEVING' }
  | { type: 'ADD_HUMAN_MESSAGE'; payload: string }
  | { type: 'INIT_MESSAGES_FROM_LOCAL_STORAGE' };

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'START_RESPONSE': {
      return {
        ...state,
        streamingMessage: {
          ...state.streamingMessage,
          content: ''
        },
      };
    }

    case 'CHUNK_RETRIEVED': {
      return {
        ...state,
        streamingMessage: {
          content: state.streamingMessage.content + action.payload,
          loading: false
        },
      };
    }

    case 'DONE_RETRIEVING': {
      const messages: Message[] = [
        ...state.messages,
        { content: state.streamingMessage.content, owner: 'ai' },
      ];

      localStorage.setItem('messages', JSON.stringify(messages));

      return {
        ...state,
        messages,
        streamingMessage: {
          ...state.streamingMessage,
          loading: false,
          content: ''
        },
      };
    }

    case 'ADD_HUMAN_MESSAGE': {
      const messages: Message[] = [
        ...state.messages,
        { content: action.payload, owner: 'human' },
      ];

      localStorage.setItem('messages', JSON.stringify(messages));

      return {
        ...state,
        streamingMessage: {
          ...state.streamingMessage,
          loading: true,
        },
        messages,
      };
    }

    case 'RESET_CHAT': {
      localStorage.removeItem('messages');

      return {
        ...state,
        messages: [],
        streamingMessage: {
          content: '',
          loading: false
        }
      };
    }

    case 'SET_ERROR': {
      return {
        ...state,
        error: action.payload,
      };
    }

    case 'INIT_MESSAGES_FROM_LOCAL_STORAGE': {
      const messages = localStorage.getItem('messages') ?? '[]';
      
      return {
        ...state,
        messages: JSON.parse(messages) as Message[]
      };
    }

    default: {
      throw new Error(`Unknown action: ${action}`);
    }
  }
}

const Chat: React.FC = () => {
  const [state, dispatch] = useReducer(chatReducer, {
    messages: [],
    streamingMessage: {
      content: '',
      loading: false
    },
    error: null,
  });

  const { send, cancel } = useStreamingFetch({
    url: '/api/prompt',
    method: 'POST',
    onStart: () => dispatch({ type: 'START_RESPONSE' }),
    onChunk: (chunk) => dispatch({ type: 'CHUNK_RETRIEVED', payload: chunk }),
    onDone: () => dispatch({ type: 'DONE_RETRIEVING' }),
    onError: (error) => dispatch({ type: 'SET_ERROR', payload: error }),
  });

  const sendPrompt = useCallback(async (prompt: string) => {
    dispatch({ type: 'ADD_HUMAN_MESSAGE', payload: prompt });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    // Convert client messages to server format (owner -> type)
    // Only send previous conversation history, not the current prompt
    const serverMessages = state.messages.map(msg => ({
      type: msg.owner,
      content: msg.content
    }));

    await send({ prompt, messages: serverMessages });
  }, [state.messages, send]);

  const cancelStream = useCallback(() => {
    cancel();
    dispatch({ type: 'DONE_RETRIEVING' });
    dispatch({ type: 'SET_ERROR', payload: null });
  }, [cancel]);

  useEffect(() => {
    dispatch({ type: 'INIT_MESSAGES_FROM_LOCAL_STORAGE' });
    
    const autoPrompt = localStorage.getItem('autoPrompt') ?? '';

    if (autoPrompt) {
      localStorage.removeItem('autoPrompt');

      sendPrompt(autoPrompt);
    }
  }, [])

  const dismissError = useCallback(() => {
    dispatch({ type: 'SET_ERROR', payload: null });
  }, []);

  const handleStarterClick = useCallback(async (text: string) => {
    await sendPrompt(text);
  }, [sendPrompt]);

  return (
    <div className={`flex flex-col h-full w-full z-100`}>
      <div
        id="chat"
        className={`flex flex-col grow overflow-hidden`}
        aria-label="Chat interface"
      >
        <div className="flex items-center border-b border-slate-200 dark:border-slate-800 p-4">
          <button
            onClick={() => redirect('/', RedirectType.replace)}
            title="Go back"
            className="mr-4 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-foreground rounded-full w-8 h-8 flex items-center justify-center shadow focus:outline-none cursor-pointer"
            aria-label="Go back"
          >
            <LeftArrowIcon className="w-4 h-4" />
          </button>

          <div className="grow">
            <h2 className="text-lg font-semibold text-foreground">Chat with me</h2>
            <p className="text-sm text-foreground">I am here to help you with your questions.</p>
          </div>
          <button
            onClick={() => dispatch({ type: 'RESET_CHAT' })}
            title="Reset chat"
            className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-foreground rounded-full w-8 h-8 flex items-center justify-center shadow focus:outline-none cursor-pointer"
            aria-label="Reset chat"
          >
            ↺
          </button>
        </div>

        <div className="self-center w-full lg:w-3/4 xl:w-1/2 p-4">
          <div className="mt-16"></div>

          <Messages
            initialMessages={state.messages}
            streamedMessage={state.streamingMessage.content}
            loading={state.streamingMessage.loading}
            onStarterClick={handleStarterClick}
          />

          <div className="mb-16"></div>

          <Input
            isFocused={true}
            isLoading={state.streamingMessage.loading}
            error={state.error}
            onSend={sendPrompt}
            onCancel={cancelStream}
            onDismissError={dismissError}
          />
        </div>
      </div>
    </div>
  );
}

export default Chat;
