import React, { useEffect, useRef } from "react";

export type Message = {
  content: string,
  owner: 'human' | 'ai'
}

export type StreamingMessage = {
  isActive: boolean,
  message: Message
}

type MessagesProps = {
  initialMessages: Message[],
  streamedMessage: string,
  loading: boolean
}

const Messages: React.FC<MessagesProps> = ({ initialMessages, streamedMessage, loading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // This code only runs on the client/browser
  // useEffect(() => {
  //   setTimeout(() => localStorage.removeItem('closeEvent'), 10000);
    
  //   window.addEventListener('beforeunload', (event) => {
  //     navigator.sendBeacon('/api/close');
  //   })
  // }, []);

  // useEffect(() => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  // }, [initialMessages, streamedMessage, loading]);

  const hasMessages = initialMessages.length > 0 || streamedMessage || loading;

  return (
    <section 
      className="w-full grow overflow-y-auto p-4 lg:p-8"
      aria-label="Chat messages"
      role="log"
      aria-live="polite"
    >
      {!hasMessages && (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <div className="text-6xl mb-4 opacity-60">🤖</div>
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Welcome!
          </h2>
          <p className="text-foreground max-w-md mb-6">
            I am a bot, ask me anything about my portfolio, experience, or projects. I'm here to help!
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <span className="px-4 py-2 bg-background text-foreground rounded-full text-sm hover:bg-stone-200 dark:hover:bg-stone-700/50 transition-colors">
              "Tell me about your experience"
            </span>
            <span className="px-4 py-2 bg-background text-foreground rounded-full text-sm hover:bg-stone-200 dark:hover:bg-stone-700/50 transition-colors">
              "What projects have you worked on?"
            </span>
            <span className="px-4 py-2 bg-background text-foreground rounded-full text-sm hover:bg-stone-200 dark:hover:bg-stone-700/50 transition-colors">
              "What technologies do you use?"
            </span>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {initialMessages.map(({ content, owner }, index) => (
          <div
            key={index}
            className={`flex w-full ${owner === 'human' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`rounded-2xl px-4 py-3 shadow-sm ${
                owner === 'human'
                  ? 'bg-stone-600 dark:bg-stone-700 text-white rounded-br-sm max-w-7/10'
                  : 'bg-background text-foreground rounded-bl-sm'
              }`}
              role={owner === 'human' ? 'user-message' : 'assistant-message'}
            >
              <div className="flex items-start gap-2">
                {owner === 'ai' && (
                  <span className="text-lg shrink-0 opacity-70" aria-hidden="true">🤖</span>
                )}
                <p className="text-base leading-relaxed whitespace-pre-wrap wrap-break-words">
                  {content}
                </p>
                {owner === 'human' && (
                  <span className="text-lg shrink-0 opacity-80" aria-hidden="true">👤</span>
                )}
              </div>
            </div>
          </div>
        ))}

        {loading && !streamedMessage && (
          <div className="flex justify-start">
            <div className="bg-background rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="text-lg opacity-70" aria-hidden="true">🤖</span>
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 bg-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
                <span className="sr-only">AI is typing</span>
              </div>
            </div>
          </div>
        )}

        {streamedMessage && (
          <div className="flex justify-start">
            <div className="bg-background text-foreground rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
              <div className="flex items-start gap-2">
                <span className="text-lg shrink-0 opacity-70" aria-hidden="true">🤖</span>
                <p className="text-base leading-relaxed whitespace-pre-wrap wrap-break-words">
                  {streamedMessage}
                  {loading && (
                    <span className="inline-block w-2 h-4 ml-1 bg-foreground animate-pulse rounded-sm" aria-hidden="true"></span>
                  )}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div ref={messagesEndRef} />
    </section>
  )
}

export default Messages;