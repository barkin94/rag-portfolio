import { cookies } from "next/headers";

import WithFadeInAnimation from "@/common/components/FadeInOnViewportEntry";
import Chat from "./_components/Chat";
import mongodb from "@/backend/mongodb";
import { Message } from "@/common/types";

export default async function AmaPage() {
  const initialMessages = await getInitialMessages();

  return (
    <WithFadeInAnimation>
      <Chat initialMessages={initialMessages} />
    </WithFadeInAnimation>
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
