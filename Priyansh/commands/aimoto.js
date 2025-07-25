const axios = require("axios");
const fs = require("fs-extra");

const statusPath = __dirname + "/moto_status.json";

module.exports.config = {
  name: "moto",
  version: "1.0",
  hasPermssion: 0,
  credits: "Talha Pathan",
  description: "GPT-4o AI using RapidAPI with on/off toggle",
  commandCategory: "AI",
  usages: "[prompt]",
  cooldowns: 3,
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, senderID } = event;
  const input = args.join(" ").toLowerCase();

  // ✅ Create status file if not exist
  if (!fs.existsSync(statusPath)) fs.writeFileSync(statusPath, JSON.stringify({}));

  let status = JSON.parse(fs.readFileSync(statusPath));

  // ✅ Handle ON/OFF Commands
  if (input === "moto on") {
    status[threadID] = true;
    fs.writeFileSync(statusPath, JSON.stringify(status, null, 2));
    return api.sendMessage("🤖 Moto AI is now ON. Ask me anything!", threadID, messageID);
  }

  if (input === "moto off") {
    status[threadID] = false;
    fs.writeFileSync(statusPath, JSON.stringify(status, null, 2));
    return api.sendMessage("🛑 Moto AI is now OFF.", threadID, messageID);
  }

  if (!status[threadID]) return; // If off, do nothing

  // ✅ Moto AI Active – Handle GPT-4o reply
  const prompt = args.join(" ");
  if (!prompt) return api.sendMessage("❗ Sawal to pocho Moto se!", threadID, messageID);

  try {
    // 💬 Special Case: Who made you?
    const lowerPrompt = prompt.toLowerCase();
    if (["tumhy kis ny bnaya", "tumhe kisne banaya", "creator", "owner"].some(q => lowerPrompt.includes(q))) {
      return api.sendMessage("💖 Mujhe Talha bhai ne banaya hai. Mein sirf unka hoon. 😌", threadID, messageID);
    }

    // 🤖 GPT-4o API via RapidAPI
    const res = await axios.post(
      "https://cheapest-gpt-4-turbo-gpt-4-vision-chatgpt-openai-ai-api.p.rapidapi.com/v1/chat/completions",
      {
        messages: [
          { role: "user", content: prompt }
        ],
        model: "gpt-4o",
        max_tokens: 200,
        temperature: 0.9
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-rapidapi-host": "cheapest-gpt-4-turbo-gpt-4-vision-chatgpt-openai-ai-api.p.rapidapi.com",
          "x-rapidapi-key": "f3d8421651msh284326842a2b9fbp184c6cjsn5de97980a85a"
        }
      }
    );

    const reply = res.data.choices[0].message.content;
    api.sendMessage("🧠 Moto: " + reply.trim(), threadID, messageID);

  } catch (err) {
    console.error("Moto Error:", err.response?.data || err.message);
    api.sendMessage("❌ Moto AI error: " + (err.response?.data?.message || err.message), threadID);
  }
};
