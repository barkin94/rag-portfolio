import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { UpstashVectorStore } from "@langchain/community/vectorstores/upstash";
import config from '../config';
import { indexWithEmbeddings } from './upstash-repo';

export const embeddings = new HuggingFaceInferenceEmbeddings({
  apiKey: config.HF_EMBEDDINGS_API_KEY,
  model: config.HF_EMBEDDINGS_MODEL,
  provider: "hf-inference",
  maxRetries: 3
});

export const vectorStore = new UpstashVectorStore(embeddings, {
  index: indexWithEmbeddings,
});