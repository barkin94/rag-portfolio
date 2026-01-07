'use client'

import { useState, useRef, useEffect } from "react";
import { CancelIcon, SendIcon, ExpandIcon } from "../Icons";

interface InputProps {
  isFocused?: boolean,
  isLoading?: boolean
  error?: string | null
  showExpandButton?: boolean
  onSend?: (prompt: string) => void
  onCancel?: () => void
  onDismissError?: () => void
  onExpand?: () => void
}

const Input: React.FC<InputProps> = ({
  isFocused,
  isLoading,
  error = null,
  onSend,
  onCancel,
  onDismissError,
  onExpand,
  showExpandButton = false,
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

  // force textarea to focus/blur if explicitly passed in props
  if (textareaRef.current && isFocused != undefined) {
    isFocused ? textareaRef.current.focus() : textareaRef.current.blur()
  }

  const submitPrompt = async (prompt: string) => {
    if (!prompt || isLoading) {
      return;
    }

    setInputValue('')
    await onSend?.(prompt)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!isTouchDevice && e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submitPrompt(inputValue.trim())
    }
  }

  const handleCancel = () => {
    onCancel?.()
  }

  return (
    <>
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
      <div className="flex items-center gap-3">
        <div className="grow relative">
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything..."
            className="w-full resize-none overflow-y-hidden p-4 text-base 
                      bg-background text-foreground
                      rounded-3xl border border-slate-300 dark:border-slate-800
                      focus:outline-none focus:ring-slate-500/50 dark:focus:ring-slate-400/50
                      focus:border-slate-400 dark:focus:border-slate-500
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
            title="Cancel request"
            type="button"
            className="p-3 rounded-full border-2 border-slate-400 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-400 dark:hover:bg-slate-600 hover:text-slate-900 dark:hover:text-slate-100 transition-all duration-300 hover:scale-110 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
            aria-label="Cancel request"
          >
            <CancelIcon />
          </button>
        ) : (
          <button
            onClick={() => submitPrompt(inputValue.trim())}
            title="Send message"
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className={`p-3 rounded-full border-2 transition-all duration-300 hover:scale-110 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-slate-400 border-slate-400
                ${inputValue.trim() && !isLoading
                ? 'dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-400 dark:hover:bg-slate-600 hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer'
                : 'dark:border-slate-700 text-slate-400 dark:text-slate-600 cursor-not-allowed opacity-50'
              }`}
            aria-label="Send message"
          >
            <SendIcon />
          </button>
        )}


        {showExpandButton && (
          <button
            onClick={onExpand}
            title="Expand chat"
            type="button"
            className="p-3 rounded-full border-2 border-slate-400 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-400 dark:hover:bg-slate-600 hover:text-slate-900 dark:hover:text-slate-100 transition-all duration-300 hover:scale-110 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
            aria-label="Expand chat"
          >
            <ExpandIcon />
          </button>
        )}
      </div>
    </>
  );
};



export default Input;