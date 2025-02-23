import { Vector } from "@upstash/vector";

// ✅ Doğru import ve yapılandırma
export const vectorDB = new Vector({
  url: process.env.UPSTASH_VECTOR_URL!,
  token: process.env.UPSTASH_VECTOR_TOKEN!,
});
