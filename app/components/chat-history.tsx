import React from "react";

export type Message = {
  content: string,
  owner: 'user'|'ai'
}

export type StreamingMessage = {
    isActive: boolean,
    message: Message
}

type ChatHistoryProps = {
    initialMessages: Message[],
    streamedMessage: string,
    loading: boolean
}

export const ChatHistory: React.FC<ChatHistoryProps> = ({ initialMessages, streamedMessage, loading }) => {
    return (
        <>
            {initialMessages.map(({ content, owner }, index) => (
                <div
                    className={`mb-4 flex w-full ${owner === 'user' ? 'w-1/2 justify-end' : ''}`}
                    key={index}>
                    <span className="">{content}</span>    
                </div>
            ))}
            {loading && <div>Loading...</div>}
            {streamedMessage && <div>{streamedMessage}</div>}
        </>
    )
}