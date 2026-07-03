import resumeChunks from "@/backend/data-chunks/resume";
import portfolioChunks from "@/backend/data-chunks/portfolio";
import interviewQnAChunks from "@/backend/data-chunks/interview-QnA";
import behavioralStoryChunks from "@/backend/data-chunks/behavioral-stories";
import vectorStore from "@/backend/vector-store";
import logger from "@/logger";

export async function PUT() {
  const documents = [
    ...resumeChunks,
    ...portfolioChunks,
    ...interviewQnAChunks,
    ...behavioralStoryChunks
  ];
  
  try{
    await vectorStore.delete({deleteAll: true});
    await vectorStore.addDocuments(documents)
  } catch (error) {
    logger.error(error, "Failed to sync database");
    return new Response('Failed to sync database', { status: 500 });
  }
  
  return new Response('Database synced successfully', { status: 200 });
}