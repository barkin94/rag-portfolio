import { ChatOpenAI } from "@langchain/openai";

import config from '@/backend/shared/config';
import { FullResumeSchema } from './parser';

function getNemotronModel() {
  return new ChatOpenAI({
    model: config.RESUME_PARSER_MODEL,
    apiKey: config.RESUME_PARSER_API_KEY,
    maxRetries: config.RESUME_PARSER_MAX_RETRIES,
    timeout: config.RESUME_PARSER_TIMEOUT,
    configuration: {
      baseURL: "https://integrate.api.nvidia.com/v1",
    },
  });
}

export const cvSyncAgent = getNemotronModel().withStructuredOutput(FullResumeSchema);

export function getCvSyncAgent() {
  return cvSyncAgent;
}