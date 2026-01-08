import React, { useEffect, useRef } from "react";

export type Message = {
  content: string;
  owner: "human" | "ai";
};

export type StreamingMessage = {
  isActive: boolean;
  message: Message;
};

type MessagesProps = {
  initialMessages: Message[];
  streamedMessage: string;
  loading: boolean;
  onStarterClick?: (text: string) => void;
};

const Messages: React.FC<MessagesProps> = ({
  initialMessages,
  streamedMessage,
  loading,
  onStarterClick,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Use 'auto' for streaming to stay pinned to the bottom without lag
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [initialMessages, streamedMessage, loading]);
  
  const hasMessages = initialMessages.length > 0 || streamedMessage || loading;

  return (
    <section
      className="w-full grow overflow-y-auto"
      aria-label="Chat messages"
      role="log"
      aria-live="polite"
    >
      {!hasMessages && (
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

      <div className="space-y-4">
        {initialMessages.map(({ content, owner }, index) => (
          <div
            key={index}
            className={`flex w-full ${owner === "human" ? "justify-end" : "justify-start"
              }`}
          >
            <div
              className={`rounded-2xl py-3 shadow-sm ${owner === "human"
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
                <p className="text-base px-4 leading-relaxed whitespace-pre-wrap wrap-break-words">
                  {content}
                </p>
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
        ))}

        {loading && !streamedMessage && (
          <div className="flex justify-start">
            <div className="bg-background rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="text-lg opacity-70" aria-hidden="true">
                  🤖
                </span>
                <div className="flex gap-1.5">
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
              </div>
            </div>
          </div>
        )}

        {streamedMessage && (
          <div className="flex justify-start">
            <div className="bg-background text-foreground rounded-2xl rounded-bl-sm py-3 shadow-sm">
              <div className="flex items-start gap-2">
                <span
                  className="text-lg shrink-0 opacity-70"
                  aria-hidden="true"
                >
                  🤖
                </span>
                <p className="text-base  px-4 leading-relaxed whitespace-pre-wrap wrap-break-words">
                  {streamedMessage}
                  {loading && (
                    <span
                      className="inline-block w-2 h-4 ml-1 bg-foreground animate-pulse rounded-sm"
                      aria-hidden="true"
                    ></span>
                  )}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div ref={messagesEndRef} />
    </section>
  );
};

export default Messages;
