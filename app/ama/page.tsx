import { cookies } from "next/headers";

import Chat from "./_components/Chat";
import * as mongodb from "@/backend/shared/mongodb";
import { Message } from "@/backend/shared/types";

export default async function AmaPage() {
  const initialMessages = await getInitialMessages();

  return (
    <Chat initialMessages={initialMessages} />
  );
}

async function getInitialMessages(): Promise<Message[]> {
  const cookieStore = await cookies();
  const threadId = cookieStore.get("t_id")?.value;

  if (!threadId) {
    return [];
  }

  const messages = await mongodb.getMessages(threadId);

  return messages ?? []
} 
