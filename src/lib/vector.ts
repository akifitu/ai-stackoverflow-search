import { createClient } from "@upstash/vector";

// ✅ Upstash Vector DB istemcisi oluştur
export const vectorDB = createClient({
  url: process.env.UPSTASH_VECTOR_URL!,
  token: process.env.UPSTASH_VECTOR_TOKEN!,
});
