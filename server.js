// =======================================
// RAIA AI Server - Gemini 3 Flash Preview
// =======================================

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { GoogleGenAI } = require("@google/genai");

const app = express();
app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const PORT = process.env.PORT || 3000;

app.post("/analyze", async (req, res) => {
  try {
    const { url, text } = req.body;

    if (!text) {
      return res.json({
        score: 50,
        reason: "Không có nội dung để phân tích."
      });
    }

    const prompt = `
Bạn là hệ thống AI đánh giá độ an toàn website.

THANG ĐIỂM:
0 = Cực kỳ nguy hiểm
100 = An toàn tuyệt đối

Yêu cầu:
- Trả JSON hợp lệ
- Reason đúng 3 dòng
- Không thêm text ngoài JSON

{
  "score": 0,
  "reason": "dòng1\\ndòng2\\ndòng3"
}

URL: ${url}

Nội dung:
${text.slice(0, 4000)}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    const aiText = response.text.trim();

    let parsed;

    try {
      const jsonMatch = aiText.match(/\{[\s\S]*\}/);
      parsed = JSON.parse(jsonMatch[0]);
    } catch {
      parsed = {
        score: 50,
        reason: aiText.substring(0, 300)
      };
    }

    let finalScore = Number(parsed.score);
    if (isNaN(finalScore)) finalScore = 50;
    if (finalScore < 0) finalScore = 0;
    if (finalScore > 100) finalScore = 100;

    res.json({
      score: finalScore,
      reason: parsed.reason || "Không có giải thích."
    });

  } catch (err) {
    console.error("🔥 Gemini 3 ERROR:", err);
    res.json({
      score: null,
      reason: "Lỗi khi kết nối Gemini 3."
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 RAIA Server chạy tại http://localhost:${PORT}`);
  console.log("🤖 Model: gemini-3-flash-preview");
});