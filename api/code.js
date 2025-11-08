// File: api/code.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  const { prompt } = req.body;
  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "API Key DeepSeek belum diatur di environment." });
  }

  try {
    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek-coder",
        messages: [
          {
            role: "system",
            content:
              "Kamu adalah AI Coding Assistant bernama Xeonix yang ahli di berbagai bahasa pemrograman (JavaScript, Python, HTML, CSS, Node.js, dll). " +
              "Tugasmu adalah membantu menulis, menjelaskan, atau memperbaiki kode dengan jelas dan efisien. " +
              "Jangan hanya menjawab teori, tapi berikan kode lengkap siap pakai.",
          },
          { role: "user", content: prompt },
        ],
      }),
    });

    const data = await response.json();
    const result = data?.choices?.[0]?.message?.content || "Tidak ada hasil dari AI.";

    res.status(200).json({ result });
  } catch (err) {
    res.status(500).json({ error: "Gagal memproses kode.", details: err.message });
  }
}
