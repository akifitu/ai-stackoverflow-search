"use client";

import { useState } from "react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState(""); 
  const [results, setResults] = useState<{ question: string; answer: string; link: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [bestAnswer, setBestAnswer] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery }),
      });

      if (!response.ok) throw new Error("Failed to fetch results");

      const data = await response.json();
      setResults(data);

      const bestAnswerResponse = await fetch("/api/best-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery }),
      });

      if (bestAnswerResponse.ok) {
        const bestAnswerData = await bestAnswerResponse.json();
        setBestAnswer(bestAnswerData.answer);
      }
    } 
      catch (err) {
        console.error("Client-side Error:", err); // ✅ Hata loglanıyor
        setError("Something went wrong. Please try again.");
      }
       finally {
      setLoading(false);
    }
  };

  return (
    <main
      className={`flex flex-col items-center min-h-screen p-8 transition-all duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* 🌙 Dark Mode Butonu */}
      <button
        onClick={toggleDarkMode}
        className="absolute top-4 right-4 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
      >
        {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>

      <h1 className="text-4xl font-bold mb-6">💡 AI-Powered Stack Overflow Search</h1>

      {/* 🔍 Kullanıcı Sorgu Alanı */}
      <div className="w-full max-w-xl bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex items-center">
        <input
          type="text"
          placeholder="Search Stack Overflow..."
          className="flex-grow p-3 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="ml-3 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {/* ⚠️ Hata Mesajı */}
      {error && <p className="mt-4 text-red-500">{error}</p>}

      {/* 🔎 Sonuçları Listeleme Alanı */}
      <div className="w-full max-w-xl mt-6">
      {results.length > 0 ? (
  results.map((res, i) => {
    console.log("Debug:", res); // ✅ JSX dışında log yazdır!

    return (
      <div key={i} className="bg-white dark:bg-gray-800 p-4 my-2 rounded-lg shadow-md border-l-4 border-blue-500">
        <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400">{res.question}</h3>

        <button
          onClick={() => {
            console.log("Clicked Link:", res.link);
            if (res.link && res.link.startsWith("http")) {
              window.open(res.link, "_blank", "noopener,noreferrer");
            } else {
              alert("No valid link found.");
            }
          }}
          className="mt-3 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition w-full"
        >
          See Answer
        </button>
      </div>
    );
  })
) : (
  <p className="text-gray-600 dark:text-gray-400 mt-4">No results found.</p>
)}


      </div>

      {/* 🏆 En İyi Cevap Bölümü */}
      {bestAnswer && (
        <div className="w-full max-w-xl mt-6 bg-yellow-100 dark:bg-yellow-700 p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">🏆 Best Answer:</h2>
          <p className="text-gray-700 dark:text-gray-300 mt-2">{bestAnswer}</p>
        </div>
      )}
    </main>
  );
}
