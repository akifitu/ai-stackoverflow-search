import { vectorDB } from "@/lib/vector";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// 📌 Kullanıcının sorgusuna en yakın cevapları getir
export async function searchStackOverflow(question: string) {
  const embedding = await getEmbedding(question);
  
  // 🔹 Upstash Vector ile en benzer 5 cevabı getir
  const results = await vectorDB.query({
    vector: embedding,
    topK: 5, // En yakın 5 sonucu al
  });

  return results.matches.map((match: { metadata: Record<string, unknown> }) => match.metadata);
}

// 📌 OpenAI Embeddings API ile vektör oluştur
async function getEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({ // ✅ YENİ SİNTAX
    model: "text-embedding-ada-002",
    input: text,
  });

  return response.data[0].embedding; // ✅ YENİ DÖNÜŞ TİPİ
}
