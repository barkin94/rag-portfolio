import React, { useEffect, useRef } from "react";
import { ChatState } from "..";

export type Message = {
  content: string;
  owner: "human" | "ai";
};

export type StreamingMessage = {
  isActive: boolean;
  message: Message;
};

type MessageHistoryProps = {
  messages: Message[];
  responseMessage: ChatState['responseMessage'];
  onStarterClick?: (text: string) => void;
};

const MessageHistory: React.FC<MessageHistoryProps> = ({
  messages,
  responseMessage,
  onStarterClick,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Use 'auto' for streaming to stay pinned to the bottom without lag
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [responseMessage.content]);


  return (
    <section
      className="w-full grow overflow-y-auto"
      aria-label="Chat messages"
      role="log"
      aria-live="polite"
    >
      {!messages.length && (
        <div className="flex flex-col items-center justify-center text-center">
          <div className="text-6xl mb-4 opacity-60">🤖</div>
          <h2 className="text-2xl font-bold text-foreground mb-6">Welcome!</h2>
          <p className="text-foreground max-w-md mb-6">
            Ask me anything about my portfolio, experience, or projects. I'm here to help!
          </p>
          <div
            id="chat-starter-messages"
            className="flex flex-wrap gap-2 justify-center"
          >
            {['Tell me about your experience', 'What projects have you worked on?', 'What technologies do you use?'].map((starterText) => (
              <button
                key={starterText}
                onClick={() => onStarterClick?.(starterText)}
                className="px-4 py-2 bg-background text-foreground rounded-full text-sm hover:bg-slate-200 dark:hover:bg-slate-700/50 transition-colors border border-slate-200 dark:border-slate-800 cursor-pointer"
              >
                {starterText}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="my-4">
        {messages.map(({ content, owner }, index) => (
          <MessageComponent key={index} owner={owner} content={content} />
        ))}

        {responseMessage.isActive && <div className="flex w-full justify-start">
          <div>
            {responseMessage.loading && (
              <>
                <div className="flex gap-1.5 items-center pt-4">
                  <span
                    className="pr-4 text-lg shrink-0 opacity-70"
                    aria-hidden="true"
                  >
                    🤖
                  </span>
                  <span
                    className="w-2 h-2 bg-foreground rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></span>
                  <span
                    className="w-2 h-2 bg-foreground rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></span>
                  <span
                    className="w-2 h-2 bg-foreground rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></span>
                </div>
                <span className="sr-only">AI is typing</span>
              </>
            )}
            {responseMessage.content && (
              <MessageComponent owner="ai" content={responseMessage.content} />
            )}
          </div>
        </div>}
      </div>

      <div ref={messagesEndRef} />
    </section>
  );
};

export default MessageHistory;

const MessageComponent: React.FC<Message> = ({ owner, content }) => {
  return (
    <div
      className={`flex w-full ${owner === "human" ? "justify-end" : "justify-start"
        }`}
    >
      <div
        className={`rounded-2xl py-4 ${owner === "human"
          ? "bg-slate-600 dark:bg-slate-700 text-white rounded-br-sm max-w-7/10"
          : "text-foreground rounded-bl-sm"
          }`}
        role={owner === "human" ? "user-message" : "assistant-message"}
      >
        <div className="flex items-start gap-2">
          {owner === "ai" && (
            <span
              className="text-lg shrink-0 opacity-70"
              aria-hidden="true"
            >
              🤖
            </span>
          )}
          <div id="message-content" className="text-base pl-4 leading-relaxed whitespace-pre-wrap wrap-break-words">
            {content}
          </div>
          {owner === "human" && (
            <span
              className="text-lg shrink-0 opacity-80 pr-2"
              aria-hidden="true"
            >
              👤
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
