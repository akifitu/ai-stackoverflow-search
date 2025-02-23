import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const questionId = searchParams.get("id");

  if (!questionId) {
    return NextResponse.json({ error: "Question ID is required" }, { status: 400 });
  }

  // ✅ `filter=withbody` ekleyerek cevapların içeriğini (body) çekiyoruz.
  const apiUrl = `https://api.stackexchange.com/2.3/questions/${questionId}/answers?order=desc&sort=votes&site=stackoverflow&filter=withbody`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      return NextResponse.json({ error: "No answers found" }, { status: 404 });
    }

    // 📌 Kabul edilmiş cevap var mı kontrol edelim (is_accepted = true olan)
    const acceptedAnswer = data.items.find((answer) => answer.is_accepted);
    
    // Eğer kabul edilmiş cevap yoksa, en yüksek oyu olan cevabı al
    const bestAnswer = acceptedAnswer || data.items[0];

    return NextResponse.json({ bestAnswer });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch answer" }, { status: 500 });
  }
}
