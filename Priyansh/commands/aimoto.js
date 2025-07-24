const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const moment = require("moment-timezone");

module.exports.config = {
  name: "moto",
  version: "5.2.0",
  hasPermission: 2,
  credits: "M Talha ",
  description: "AI Pathan Boy Moto with smart UID memory and tone-based replies",
  commandCategory: "ai",
  usages: "[your message]",
  cooldowns: 5,
};

const memory = {};

const getUserName = async (api, id) => {
  try {
    const user = await api.getUserInfo(id);
    return user[id]?.name || "user";
  } catch {
    return "user";
  }
};

// 🧠 TONE DETECTION
function detectTone(input) {
  const lowered = input.toLowerCase();
  if (lowered.includes("love") || lowered.includes("baby") || lowered.includes("moto") || lowered.includes("❤️")) return "romantic";
  if (lowered.includes("haha") || lowered.includes("funny") || lowered.includes("joke")) return "funny";
  if (lowered.includes("life") || lowered.includes("alone") || lowered.includes("deep")) return "deep";
  return "normal";
}

// 💬 AI BOT LOGIC
module.exports.run = async ({ api, event, args }) => {
  const input = args.join(" ");
  const uid = event.senderID;
  const userName = await getUserName(api, uid);
  const tone = detectTone(input);

  // ⏳ Typing simulation
  api.sendTypingIndicator(event.threadID, true);

  const messageHistory = memory[uid] || [];

  messageHistory.push({ role: "user", content: input });

  // 💡 PROMPT
  const systemPrompt = `You're a soft, sweet, and flirty Pathan boy named Moto Pathan. You talk like a caring Pathan, and always reply with charm and love. Speak in casual, Urdu-English mix. Use cute emojis. The user's name is ${userName}. If user is rude, you reply softly but tease him.`;

  const messages = [
    { role: "system", content: systemPrompt },
    ...messageHistory.slice(-5)
  ];

  try {
    const OPENAI_API_KEY = "sk-XXXX"; // 🔐 <-- Replace this with your actual OpenAI API key

    const res = await axios.post("https://api.openai.com/v1/chat/completions", {
      model: "gpt-3.5-turbo",
      messages,
      temperature: 0.85
    }, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      }
    });

    const botReply = res.data.choices[0].message.content.trim();
    messageHistory.push({ role: "assistant", content: botReply });

    memory[uid] = messageHistory;

    api.sendMessage(`💞 ${botReply}`, event.threadID, event.messageID);

  } catch (e) {
    console.error("❌ Moto Error:", e.message);
    api.sendMessage("🚫 Moto Pathan abhi busy hai, thodi dair baad aana bro 🥲", event.threadID, event.messageID);
  }
};
