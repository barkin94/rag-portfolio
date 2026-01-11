'use client';

import React, { useCallback, useEffect, useReducer } from "react";
import { redirect, RedirectType } from 'next/navigation'

import Input from "@/common/components/Input";
import MessageHistory, { Message } from "./MessageHistory";
import { LeftArrowIcon } from "@/common/components/Icons";
import { useStreamingFetch } from "@/common/hooks/useStreamingFetch";

export type ChatState = {
  error: string | null;
  messages: Message[];
  responseMessage: {
    isActive: boolean;
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
        responseMessage: {
          isActive: true,
          loading: true,
          content: ''
        },
      };
    }

    case 'CHUNK_RETRIEVED': {
      return {
        ...state,
        responseMessage: {
          isActive: true,
          loading: false,
          content: state.responseMessage.content + action.payload,
        },
      };
    }

    case 'DONE_RETRIEVING': {
      const messages: Message[] = [
        ...state.messages,
        { content: state.responseMessage.content, owner: 'ai' },
      ];

      localStorage.setItem('messages', JSON.stringify(messages));

      return {
        ...state,
        messages,
        responseMessage: {
          isActive: false,
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
        responseMessage: {
          isActive: true,
          loading: true,
          content: '',
        },
        messages,
      };
    }

    case 'RESET_CHAT': {
      localStorage.removeItem('messages');

      cookieStore.delete('t_id');

      return {
        ...state,
        messages: [],
        responseMessage: {
          isActive: false,
          loading: false,
          content: '',
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
    responseMessage: {
      isActive: false,
      loading: false,
      content: '',
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

          <MessageHistory
            messages={state.messages}
            responseMessage={state.responseMessage}
            onStarterClick={handleStarterClick}
          />

          <div className="mb-16"></div>

          <Input
            isFocused={true}
            isLoading={state.responseMessage.loading}
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
