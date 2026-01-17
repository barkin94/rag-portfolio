import { cookies } from "next/headers";

import mongodb from "@/backend/mongodb";
import logger from '@/logger';

export async function DELETE() {
  const cookieStore = await cookies();
  const threadId = cookieStore.get('t_id')?.value;
  
  if (!threadId) {
    logger.warn('Tried to reset messages without thread ID');
    return new Response('Thread ID not found', { status: 400 });
  }
  
  // Delete the t_id cookie
  cookieStore.delete('t_id');
  
  // Delete documents asynchronously
  mongodb.resetMessages(threadId);

  return new Response(null, { status: 202 });
}