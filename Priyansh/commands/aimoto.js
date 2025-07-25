const axios = require("axios");

module.exports.config = {
  name: "moto",
  version: "1.0",
  hasPermssion: 0,
  credits: "Talha Pathan",
  description: "AI Pathan Boy (OpenAI GPT-3.5 Turbo)",
  commandCategory: "AI",
  usages: "moto [question]",
  cooldowns: 5,
};

module.exports.run = async function({ api, event, args }) {
  const input = args.join(" ");
  const { threadID, messageID } = event;

  if (!input) return api.sendMessage("📩 Pathan ko kuch boloo, chup kyun ho?", threadID, messageID);

  try {
    const res = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: input }],
        temperature: 0.7,
      },
      {
        headers: {
          "Authorization": "Bearer sk-your-openai-key", // اپنی OpenAI API Key ڈالیں
          "content-type": "application/json",
        },
        timeout: 20000,
      }
    );

    const reply = res.data.choices[0]?.message?.content || "❌ Pathan ne jawab nahi diya!";
    api.sendMessage(`💬 Pathan Moto:\n${reply}`, threadID, messageID);

  } catch (err) {
    console.error("Moto Error:", err.response?.data || err.message);
    api.sendMessage("❌ Oye! API mein masla hai, baad mein try karo.", threadID, messageID);
  }
};
