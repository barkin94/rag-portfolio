import { Index } from "@upstash/vector";
import config from '../config';

export const indexWithEmbeddings = new Index({
  url: config.UPSTASH_VECTOR_REST_URL,
  token: config.UPSTASH_VECTOR_REST_TOKEN,
});