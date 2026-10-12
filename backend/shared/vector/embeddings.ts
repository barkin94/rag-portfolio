import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { UpstashVectorStore } from "@langchain/community/vectorstores/upstash";
import { JinaEmbeddings } from "@langchain/community/embeddings/jina";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb/";


import mongodbClient from '@/backend/shared/mongodb/client';
import config from "../config";
import { indexWithEmbeddings } from "./upstash-repo";
import { OpenAIEmbeddings } from "@langchain/openai";

export const embeddings = new HuggingFaceInferenceEmbeddings({
  apiKey: config.HF_EMBEDDINGS_API_KEY,
  model: config.HF_EMBEDDINGS_MODEL,
  provider: "hf-inference",
  maxRetries: 3,
});
export const jinaEmbeddings = new JinaEmbeddings({
  apiKey: "jina_f4e44a32ca3e497c892f07bd142457dfB0P8XvOjs0rO3fl-Inw9l5XXDGPp",
  model: "jina-embeddings-v3", // 1024-dim
});

// export const vectorStore = new UpstashVectorStore(
//   new OpenAIEmbeddings({
//     model: "nvidia/nemotron-3-embed-1b",
//     apiKey: config.CHAT_AGENT_API_KEY,
//     dimensions: 1024,
//     configuration: {
//       baseURL: config.CHAT_AGENT_BASE_URL,
//     }
//   }),
//   {
//     index: indexWithEmbeddings,
//   },
// );

export const vectorStore = new MongoDBAtlasVectorSearch({
  collection: mongodbClient.db(config.MONGODB_DBNAME).collection("embeddings"),
  indexName: "embeddings_index",
});

vectorStore.embeddings = new OpenAIEmbeddings({
    model: "nvidia/nemotron-3-embed-1b",
    apiKey: config.CHAT_AGENT_API_KEY,
    configuration: {
      baseURL: config.CHAT_AGENT_BASE_URL,
    }
  });

// export const vectorStore = new UpstashVectorStore(
//   new OpenAIEmbeddings({
//     model: "jina-embeddings-v3",
//     apiKey: "jina_f4e44a32ca3e497c892f07bd142457dfB0P8XvOjs0rO3fl-Inw9l5XXDGPp",
//     configuration: {
//       baseURL: "https://api.jina.ai/v1/embedding",
//     },
//   }),
//   {
//     index: indexWithEmbeddings,
//   },
// );