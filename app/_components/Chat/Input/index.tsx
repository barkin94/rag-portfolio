'use client'

import { useState, useRef, useEffect } from "react";

const decoder = new TextDecoder();

interface InputProps {
  onSendClicked: (input: string) => void
  onResponse: () => void
  onResponseChunkRetrieved: (chunk: string) => void
  onResponseChunkRetrievalDone: () => void
}

const Input: React.FC<InputProps> = ({
  onResponseChunkRetrieved, onSendClicked, onResponse, onResponseChunkRetrievalDone
}) => {
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const [isTouchDevice, isSetTouchDevice] = useState(false);

  // This code only runs on the client/browser
  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    
    isSetTouchDevice(userAgent.includes('mobile'));
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '56px'
      const scrollHeight = textareaRef.current.scrollHeight
      textareaRef.current.style.height = `${Math.min(scrollHeight, 200)}px`
    }
  }, [inputValue])

  const handleSend = async () => {
    const prompt = inputValue.trim()

    if (!prompt || isLoading) {
      return;
    }

    setError(null)
    setInputValue('')
    setIsLoading(true)
    onSendClicked(prompt.toString())

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController()

    try {
      const response = await fetch('/api/prompt', {
        signal: abortControllerRef.current.signal,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`)
      }

      if (!response.body) {
        throw new Error('No response body received')
      }

      onResponse()

      const reader = response.body.getReader()

      while (true) {
        const { done, value } = await reader.read()
        if (done) {
          onResponseChunkRetrievalDone()
          setIsLoading(false)
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        onResponseChunkRetrieved(chunk)
      }

    } catch (err: unknown) {
      setIsLoading(false)
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          // Request was cancelled, don't show error
          return
        }
        setError(err.message || 'Failed to send message. Please try again.')
      } else {
        setError('An unexpected error occurred. Please try again.')
      }
      onResponseChunkRetrievalDone()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!isTouchDevice && e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    setIsLoading(false)
    setError(null)
    onResponseChunkRetrievalDone()
  }

  return (
    <div className="w-full end p-4 transition duration-300 border-t border-stone-200 dark:border-stone-800">
      {error && (
        <div 
          className="max-w-4xl mx-auto mb-3 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-xl text-red-700 dark:text-red-400 text-sm flex items-center justify-between backdrop-blur-sm"
          role="alert"
        >
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-4 text-red-700 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 transition-colors"
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      )}
      <div className="max-w-4xl mx-auto flex items-center gap-3">
        <div className="grow relative">
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything..."
            className="w-full resize-none overflow-y-hidden p-4 text-base 
                        bg-background text-foreground
                        rounded-3xl 
                        focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-400/50
                        focus:border-indigo-300 dark:focus:border-indigo-600
                        transition duration-300 placeholder:text-slate-400 dark:placeholder:text-slate-500
                        disabled:opacity-50 disabled:cursor-not-allowed shadow-inner h-min-[52px]"
            style={{ height: '56px', maxHeight: '200px' }}
            aria-label="Message input"
            aria-describedby="input-help"
          />
          <div id="input-help" className="sr-only">
            Type your message and press Enter to send, or Shift+Enter for a new line
          </div>
        </div>

        {isLoading ? (
          <button
            onClick={handleCancel}
            type="button"
            className="p-3 rounded-full shadow-md transition-all duration-300 
                      bg-slate-500 hover:bg-slate-600 dark:bg-slate-600 dark:hover:bg-slate-700 
                      text-white transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-slate-400"
            aria-label="Cancel request"
          >
            <CancelIcon className="w-6 h-6" />
          </button>
        ) : (
          <button
            onClick={handleSend}
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className={`p-3 rounded-full shadow-md transition-all duration-300 
                  ${inputValue.trim() && !isLoading
                ? 'bg-linear-to-br from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500/50'
                : 'bg-background text-foreground cursor-not-allowed'
              }`}
            aria-label="Send message"
          >
            <SendIcon className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
};

const SendIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);

const CancelIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export default Input;