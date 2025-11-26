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

export const Messages: React.FC<MessagesProps> = ({ initialMessages, streamedMessage, loading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [initialMessages, streamedMessage, loading]);

  const hasMessages = initialMessages.length > 0 || streamedMessage || loading;

  return (
    <section 
      className="w-full h-full overflow-y-auto p-8 mb-4"
      aria-label="Chat messages"
      role="log"
      aria-live="polite"
    >
      {!hasMessages && (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <div className="text-6xl mb-4 opacity-60">💬</div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">
            Start a conversation with me
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-md mb-6">
            Ask me anything about my portfolio, experience, or projects. I'm here to help!
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <span className="px-4 py-2 bg-slate-100 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 rounded-full text-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700/50 transition-colors">
              "Tell me about your experience"
            </span>
            <span className="px-4 py-2 bg-slate-100 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 rounded-full text-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700/50 transition-colors">
              "What projects have you worked on?"
            </span>
            <span className="px-4 py-2 bg-slate-100 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 rounded-full text-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700/50 transition-colors">
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
              className={`max-w-[80%] md:max-w-[70%] rounded-2xl px-4 py-3 shadow-sm ${
                owner === 'human'
                  ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-br-sm'
                  : 'bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 rounded-bl-sm border border-slate-200 dark:border-slate-700/50'
              }`}
              role={owner === 'human' ? 'user-message' : 'assistant-message'}
            >
              <div className="flex items-start gap-2">
                {owner === 'ai' && (
                  <span className="text-lg flex-shrink-0 opacity-70" aria-hidden="true">🤖</span>
                )}
                <p className="text-base leading-relaxed whitespace-pre-wrap break-words">
                  {content}
                </p>
                {owner === 'human' && (
                  <span className="text-lg flex-shrink-0 opacity-80" aria-hidden="true">👤</span>
                )}
              </div>
            </div>
          </div>
        ))}

        {loading && !streamedMessage && (
          <div className="flex justify-start">
            <div className="bg-slate-100 dark:bg-slate-800/80 rounded-2xl rounded-bl-sm px-4 py-3 border border-slate-200 dark:border-slate-700/50 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="text-lg opacity-70" aria-hidden="true">🤖</span>
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
                <span className="sr-only">AI is typing</span>
              </div>
            </div>
          </div>
        )}

        {streamedMessage && (
          <div className="flex justify-start">
            <div className="max-w-[80%] md:max-w-[70%] bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 rounded-2xl rounded-bl-sm px-4 py-3 border border-slate-200 dark:border-slate-700/50 shadow-sm">
              <div className="flex items-start gap-2">
                <span className="text-lg flex-shrink-0 opacity-70" aria-hidden="true">🤖</span>
                <p className="text-base leading-relaxed whitespace-pre-wrap break-words">
                  {streamedMessage}
                  {loading && (
                    <span className="inline-block w-2 h-4 ml-1 bg-slate-500 dark:bg-slate-400 animate-pulse rounded-sm" aria-hidden="true"></span>
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
