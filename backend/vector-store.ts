import { UpstashVectorStore } from "@langchain/community/vectorstores/upstash";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { Index } from "@upstash/vector";

import config from "./config";

const embeddings = new HuggingFaceInferenceEmbeddings({
  apiKey: config.HF_EMBEDDINGS_API_KEY,
  model: config.HF_EMBEDDINGS_MODEL, 
  provider: "hf-inference",
  maxRetries: 3
});

const indexWithEmbeddings = new Index({
  url: config.UPSTASH_VECTOR_REST_URL,
  token: config.UPSTASH_VECTOR_REST_TOKEN,
});

const vectorStore = new UpstashVectorStore(embeddings, {
  index: indexWithEmbeddings,
});

export default vectorStore;