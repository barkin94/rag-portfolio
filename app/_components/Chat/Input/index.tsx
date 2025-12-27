'use client'

import { useState, useRef, useEffect } from "react";

interface InputProps {
  isLoading: boolean
  error: string | null
  onSend: (prompt: string) => Promise<void>
  onCancel: () => void
  onDismissError: () => void
}

const Input: React.FC<InputProps> = ({
  isLoading, error, onSend, onCancel, onDismissError
}) => {
  const [inputValue, setInputValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
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

    setInputValue('')
    await onSend(prompt)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!isTouchDevice && e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleCancel = () => {
    onCancel()
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
            onClick={onDismissError}
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
                        rounded-3xl border border-stone-200 dark:border-stone-700
                        focus:outline-none focus:ring-stone-500/50 dark:focus:ring-stone-400/50
                        focus:border-stone-400 dark:focus:border-stone-500
                        transition duration-300 placeholder:text-stone-400 dark:placeholder:text-stone-500
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
            className="p-3 rounded-full shadow-lg shadow-stone-900/20 dark:shadow-stone-950/50 transition-all duration-300 
                      bg-stone-500 hover:bg-stone-600 dark:bg-stone-600 dark:hover:bg-stone-700 
                      text-white transform hover:scale-105 hover:shadow-xl hover:shadow-stone-900/30 dark:hover:shadow-stone-950/70 focus:outline-none focus:ring-2 focus:ring-stone-400"
            aria-label="Cancel request"
          >
            <CancelIcon className="w-6 h-6" />
          </button>
        ) : (
          <button
            onClick={handleSend}
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className={`p-3 rounded-full shadow-lg shadow-stone-900/20 dark:shadow-stone-950/50 transition-all duration-300 
                  ${inputValue.trim() && !isLoading
                ? 'bg-stone-600 dark:bg-stone-700 hover:bg-stone-700 dark:hover:bg-stone-600 text-white transform hover:scale-105 hover:shadow-xl hover:shadow-stone-900/30 dark:hover:shadow-stone-950/70 focus:outline-none focus:ring-2 focus:ring-stone-500/50'
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