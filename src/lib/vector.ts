import { Vector } from "@upstash/vector";

export const vectorDB = new Vector({
  url: process.env.UPSTASH_VECTOR_URL!,
  token: process.env.UPSTASH_VECTOR_TOKEN!,
});
