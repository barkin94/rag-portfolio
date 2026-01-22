'use client';

import { useRouter } from "next/navigation";

import ChatInput from "../../../ama/_components/Chat/ChatInput";

export default function ChatInputWithRedirect() {
  const router = useRouter();

  const handleSend = (prompt: string) => {
    localStorage.setItem('autoPrompt', prompt);
    router.replace('/ama');
  };

  return (
    <ChatInput showExpandButton={true} onSend={handleSend} />
  );
}



