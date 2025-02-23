import { createClient } from "@upstash/vector";

export const vectorDB = createClient({
  url: process.env.UPSTASH_VECTOR_URL!,
  token: process.env.UPSTASH_VECTOR_TOKEN!,
});
