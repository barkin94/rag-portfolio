import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { OpenAIEmbeddings } from "@langchain/openai";

import mongodbClient from '../mongodb/client';
import config from "../config";

export const embeddings = new OpenAIEmbeddings({
  model: config.EMBEDDING_MODEL,
  apiKey: config.EMBEDDING_API_KEY,
  configuration: {
    baseURL: config.EMBEDDING_BASE_URL,
  }
});

export const vectorStore = new MongoDBAtlasVectorSearch({
  collection: mongodbClient.db(config.MONGODB_DBNAME).collection("embeddings"),
  indexName: config.MONGODB_ATLAS_INDEX_NAME,
});

vectorStore.embeddings = embeddings;