import { vectorDB } from "@/lib/vector";
import { Configuration, OpenAIApi } from "openai";

const openai = new OpenAIApi(new Configuration({ apiKey: process.env.OPENAI_API_KEY! }));

// 📌 Kullanıcının sorgusuna en yakın cevapları getir
export async function searchStackOverflow(question: string) {
  const embedding = await getEmbedding(question);
  
  // 🔹 Upstash Vector ile en benzer 5 cevabı getir
  const results = await vectorDB.query({
    vector: embedding,
    topK: 5, // En yakın 5 sonucu al
  });

  return results.matches.map((match) => match.metadata);
}

// 📌 OpenAI Embeddings API ile vektör oluştur
async function getEmbedding(text: string): Promise<number[]> {
  const response = await openai.createEmbedding({ model: "text-embedding-ada-002", input: text });
  return response.data.data[0].embedding;
}
