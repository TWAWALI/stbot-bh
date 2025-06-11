require("dotenv").config(); // ← Always on top

const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const app = express();

// ✅ Use Render's dynamic port or fallback to 3000 locally
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static("public"));

app.post("/chat", async (req, res) => {
  const question = req.body.question;
  const apiKey = process.env.OPENROUTER_API_KEY;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "أنت مساعد دراسي ذكي لطلاب البحرين. اجب عن الأسئلة بناءً على المناهج الدراسية.",
          },
          { role: "user", content: question },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      },
    );

    const answer = response.data.choices[0].message.content;
    res.json({ answer });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.json({
      answer: "⚠️ حدث خطأ. تأكد من إعداد مفتاح API أو أعد المحاولة لاحقاً.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
