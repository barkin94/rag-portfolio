import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";

import Config from "./config";
import resumeChunks from './data-chunks/resume';
import portfolioProjectChunks from './data-chunks/projects/portfolio';

const embeddings = new HuggingFaceInferenceEmbeddings({
  apiKey: Config.HF_EMBEDDINGS_API_KEY,
  model: Config.HF_EMBEDDINGS_MODEL, 
  provider: "hf-inference",
  maxRetries: 3
});


const vectorStore = new MemoryVectorStore(embeddings);

await vectorStore.addDocuments([
  ...resumeChunks,
  ...portfolioProjectChunks
])

// Export everything
export default vectorStore;