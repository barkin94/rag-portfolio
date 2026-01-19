'use client';

import { useRouter } from "next/navigation";

import Input from "@/common/components/Input";

export default function ChatInputWithRedirect() {
  const router = useRouter();

  const handleSend = (prompt: string) => {
    localStorage.setItem('autoPrompt', prompt);
    router.replace('/ama');
  };

  return (
    <Input showExpandButton={true} onSend={handleSend} />
  );
}



