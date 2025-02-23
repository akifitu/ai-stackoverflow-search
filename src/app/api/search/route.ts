import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { query } = await req.json();
    if (!query) return NextResponse.json({ error: "Query is required" }, { status: 400 });

    const response = await fetch(`https://api.stackexchange.com/2.3/search/advanced?order=desc&sort=relevance&q=${query}&site=stackoverflow`);
    const data = await response.json();

    if (!data.items) return NextResponse.json({ error: "No results found" }, { status: 404 });

    const results = data.items.map((item: any) => ({
      question: item.title, // ❓ Sorunun başlığı
      answer: item.answer_body || "No answer available.", // ✅ Cevap eksikse "No answer available" yaz
      link: item.link || "", // 🔗 Stack Overflow linkini ekle
    }));
    

    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch Stack Overflow data" }, { status: 500 });
  }
}
