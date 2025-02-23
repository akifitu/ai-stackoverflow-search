import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { query } = await req.json();
    if (!query) return NextResponse.json({ error: "Query is required" }, { status: 400 });

    const response = await fetch(`https://api.stackexchange.com/2.3/search/advanced?order=desc&sort=relevance&q=${query}&site=stackoverflow`);
    const data = await response.json();

    if (!data.items) return NextResponse.json({ error: "No results found" }, { status: 404 });

    // ✅ `any` yerine Stack Overflow API'nin yapısına uygun bir tip kullanıyoruz
    type StackOverflowResult = {
      title: string;
      link?: string;
      answer_body?: string;
    };

    const results = data.items.map((item: StackOverflowResult) => ({
      question: item.title, 
      answer: item.answer_body || "No answer available.",
      link: item.link || "",
    }));

    return NextResponse.json(results);
  } catch (error) {
    console.error("API Fetch Error (search):", error);
    return NextResponse.json({ error: "Failed to fetch search results" }, { status: 500 });
  }
}
