'use client';

import { RedirectType, redirect } from "next/navigation";
import Input from "../Chat/Input";

export default function ChatInputWithRedirect() {
  const handleExpand = () => {
    redirect('/ama', RedirectType.replace);
  };

  const handleSend = (prompt: string) => {
    sessionStorage.setItem('prompt', prompt);
    redirect('/ama', RedirectType.replace);
  };

  return (
    <Input showExpandButton={true} onExpand={handleExpand} onSend={handleSend} />
  );
}



