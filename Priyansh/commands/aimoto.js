const axios = require("axios");

module.exports.config = {
  name: "moto",
  version: "1.0",
  hasPermssion: 0,
  credits: "Talha Pathan",
  description: "AI Pathan Boy ChatGPT (text-only)",
  commandCategory: "AI",
  usages: "moto [on/off] or [question]",
  cooldowns: 5, // Increased cooldown
};

let isMotoOn = true;

module.exports.run = async function({ api, event, args }) {
  const input = args.join(" ");
  const { threadID, messageID } = event;

  // ON/OFF Commands
  if (input.toLowerCase() === "on") {
    isMotoOn = true;
    return api.sendMessage("🤖 Moto is now ON. Bol kya baat karni hai, Pathan sun raha hai 🧠", threadID, messageID);
  }

  if (input.toLowerCase() === "off") {
    isMotoOn = false;
    return api.sendMessage("📴 Moto is now OFF. Chup hogya Pathan 😴", threadID, messageID);
  }

  if (!isMotoOn) return;

  if (!input) return api.sendMessage("📩 Pehle kuch likh to sahi puchne ke liye!", threadID, messageID);

  try {
    const res = await axios.post(
      "https://cheapest-gpt-4-turbo-gpt-4-vision-chatgpt-openai-ai-api.p.rapidapi.com/v1/chat/completions",
      {
        model: "gpt-4-turbo", // Changed to turbo for better compatibility
        messages: [{ role: "user", content: input }],
        temperature: 0.7,
        max_tokens: 500
      },
      {
        headers: {
          "content-type": "application/json",
          "X-RapidAPI-Key": "f3d8421651msh284326842a2b9fbp184c6cjsn5de97980a85a", // Replace with your key
          "X-RapidAPI-Host": "cheapest-gpt-4-turbo-gpt-4-vision-chatgpt-openai-ai-api.p.rapidapi.com"
        },
        timeout: 10000 // 10-second timeout
      }
    );

    const reply = res.data.choices[0]?.message?.content || "❌ Moto ne kuch jawab nahi diya!";
    api.sendMessage(`💬 Moto Pathan:\n${reply}`, threadID, messageID);

  } catch (err) {
    console.error("Moto Error:", err.response?.data || err.message);
    api.sendMessage("❌ Moto se baat nahi ho paayi. Kuch time baad try karo ya Owner ko batao!", threadID, messageID);
  }
};
