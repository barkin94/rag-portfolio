'use client';

import React, { useCallback, useEffect, useReducer } from "react";

import ChatInput from "./ChatInput";
import MessageHistory from "./MessageHistory";
import ChatHeader from "./Header";
import { useStreamingFetch } from "@/common/hooks/useStreamingFetch";
import { Message } from "@/common/types";
import WithFadeInAnimation from "@/common/components/FadeInOnViewportEntry";

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
  | { type: 'ADD_HUMAN_MESSAGE'; payload: string };

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
        { content: state.responseMessage.content, role: 'assistant' },
      ];

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
        { content: action.payload, role: 'user' },
      ];

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

    default: {
      throw new Error(`Unknown action: ${action}`);
    }
  }
}

type ChatProps = {
  initialMessages: Message[];
};

const Chat: React.FC<ChatProps> = ({ initialMessages }) => {
  const [state, dispatch] = useReducer(chatReducer, {
    messages: initialMessages,
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

    await send({ prompt });
  }, [state.messages, send]);

  const cancelStream = useCallback(() => {
    cancel();
    dispatch({ type: 'DONE_RETRIEVING' });
    dispatch({ type: 'SET_ERROR', payload: null });
  }, [cancel]);

  // when entered a prompt directly on home page, retrieve it from local storage and send it immediately
  useEffect(() => {
    const autoPrompt = localStorage.getItem('autoPrompt') ?? '';

    if (autoPrompt) {
      localStorage.removeItem('autoPrompt');
      sendPrompt(autoPrompt);
    }
  }, [sendPrompt])

  const dismissError = useCallback(() => {
    dispatch({ type: 'SET_ERROR', payload: null });
  }, []);

  const handleStarterClick = useCallback(async (text: string) => {
    await sendPrompt(text);
  }, [sendPrompt]);

  const handleResetChat = () => {
    if (state.messages.length === 0) {
      return;
    }

    dispatch({ type: 'RESET_CHAT' });
    fetch('/api/messages', { method: 'DELETE' })
  }

  return (
    <>
      <ChatHeader onResetChat={handleResetChat} />
      <WithFadeInAnimation>
        <div className={`flex flex-col h-full w-full z-100`}>
          <div
            id="chat"
            className={`flex flex-col grow overflow-hidden`}
            aria-label="Chat interface"
          >
            <div className="self-center w-full lg:w-3/4 xl:w-1/2 p-4">
              <div className="mt-16"></div>

              <MessageHistory
                messages={state.messages}
                responseMessage={state.responseMessage}
                onStarterClick={handleStarterClick}
              />

              <div className="mb-16"></div>

              <ChatInput
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
      </WithFadeInAnimation>
    </>
  );
}

export default Chat;
