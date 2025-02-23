import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!, // API anahtarının doğru olduğundan emin ol
});

export async function POST(req: Request) {
  try {
    const { query } = await req.json();
    if (!query) return NextResponse.json({ error: "Query is required" }, { status: 400 });

    const prompt = `Find the best answer for: ${query}`;
    const aiResponse = await openai.completions.create({
      model: "gpt-4-turbo",
      prompt,
      max_tokens: 100,
    });

    const bestAnswer = aiResponse.choices[0]?.text || "No best answer found.";
    return NextResponse.json({ answer: bestAnswer });
  } catch (error) {
    console.error("API Fetch Error (best-answer):", error); // ✅ Hata loglanıyor
    return NextResponse.json({ error: "Failed to fetch best answer" }, { status: 500 });
  }
  
}
