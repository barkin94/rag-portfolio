'use client';

import { useRouter } from "next/navigation";
import Input from "../Chat/Input";

export default function ChatInputWithRedirect() {
  const router = useRouter();

  const handleExpand = () => {
    router.replace('/ama');
  };

  const handleSend = (prompt: string) => {
    localStorage.setItem('prompt', prompt);
    router.replace('/ama');
  };

  return (
    <Input showExpandButton={true} onExpand={handleExpand} onSend={handleSend} />
  );
}



