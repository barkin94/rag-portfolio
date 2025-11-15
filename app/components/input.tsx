'use client'

import { useState } from "react";


interface InputProps {
  onSendClicked: (input: string) => void
  onResponse:() => void
  onResponseChunkRetrieved: (chunk: string) => void
  onResponseChunkRetrievalDone: () => void
}

export const Input: React.FC<InputProps> = ({
  onResponseChunkRetrieved, onSendClicked, onResponse, onResponseChunkRetrievalDone
}) => {
  const [inputValue, setInputValue] = useState('')
  
  const handleSend = async () => {
    const prompt = inputValue.trim()

    if (!prompt) {
      return;
    }

    setInputValue('')
    onSendClicked(prompt.toString())

    try {
      const abortController = new AbortController();

      const response = await fetch('/api/input', {
        signal: abortController.signal,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })

      onResponse()

      const decoder = new TextDecoder();
      const reader = response.body!.getReader()
          
      while (true) {
        const { done, value } = await reader.read()
        if (done) {
          onResponseChunkRetrievalDone()
          break;
        }

        const chunk = decoder.decode(value);

        onResponseChunkRetrieved(chunk)
      }

    } catch {}
  }

  return (
    // Fixed container at the bottom
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-gray-800 shadow-2xl border-t border-gray-200 dark:border-gray-700 transition duration-300">
      <div className="max-w-4xl mx-auto flex items-end">
        <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            //onKeyDown={handleKeyPress}
            placeholder="Ask me anything..."
            className="flex-grow resize-none overflow-y-auto p-4 mr-3 text-base 
                        bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 
                        border border-gray-300 dark:border-gray-600 rounded-3xl 
                        focus:outline-none focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-700/50
                        transition duration-300 placeholder:text-gray-500 dark:placeholder:text-gray-400"
            style={{ minHeight: '52px', maxHeight: '200px' }}
            />

            <button
            onClick={handleSend}
            type="submit"
            disabled={!inputValue.trim()}
            className={`p-3 rounded-full shadow-lg transition-all duration-300 
                ${inputValue.trim() 
                ? 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white transform hover:scale-105' 
                : 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
                }`}
            aria-label="Send message"
            >
                <SendIcon className="w-6 h-6" />
            </button>
     
      </div>
    </div>
  );
};

type InputButtonProps = {
  action: 'send' | 'cancel'

}
const abortController = new AbortController();

const SubmitButton: React.FC<InputButtonProps> = ({ action }) => {
  const [clickable, setClickable] = useState(true);

  const handleSendClick = async (message: string) => {
    try {
      const response = await fetch('/api/input', {
        signal: abortController.signal,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      })


      const decoder = new TextDecoder();
      const reader = response.body!.getReader()
          
      while (true) {
        const { done, value } = await reader.read()

        if (done) {
          console.log('Stream complete.');
          break;
        }

        const chunk = decoder.decode(value, {stream: true});

        //onResponseChunkRetrieved(chunk)
        // Process your chunk here (e.g., update UI, parse JSON)
      }

    } catch {

    }

    setClickable(true)
  }

  const handleCancelClick = () => {}

  const handleClick = () => {
    switch (action) {
      // case 'send': handleSendClick()
      // case 'cancel': handleCancelClick()
      default: true
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={!clickable}
      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
      >
      Submit
    </button>
  )
}

const SendIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);