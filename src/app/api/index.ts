import { vectorDB } from "@/lib/vector";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export default openai;


// 📌 Soru ve cevapları vektör olarak kaydet
export async function storeQuestionAnswer(question: string, answer: string, id: string) {
  // 🔹 Soru ve cevabı OpenAI ile vektör hale getir
  const embedding = await getEmbedding(question + " " + answer);
  
  // 🔹 Vektörü Upstash Vector DB'ye kaydet
  await vectorDB.upsert([{ id, values: embedding, metadata: { question, answer } }]);

  console.log(`Stored question: ${question}`);
}

// 📌 OpenAI Embeddings API ile vektör oluştur
async function getEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: text,
  });
  
  return response.data[0].embedding; // OpenAI v4 için doğru dönüş formatı
  
}
