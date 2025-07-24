const axios = require("axios");

module.exports.config = {
  name: "moto",
  version: "1.0.0",
  hasPermission: 0,
  credits: "Talha Pathan",
  description: "Pathan boy Moto with AI",
  commandCategory: "chat",
  usages: "[text]",
  cooldowns: 2,
};

module.exports.run = async ({ api, event, args }) => {
  const prompt = args.join(" ");
  if (!prompt) return api.sendMessage("💬 Kuch to bolo bhai, mein kya khud se samjhun? 😅", event.threadID, event.messageID);

  const pathanTone = `Tum ek soft, romantic, aur respectful Pathan ladke ho jo pyar bhare andaaz mein jawab deta hai. 
  Tumhara naam Talha hai. User ne ye bola: "${prompt}"`;

  try {
    const res = await axios.post(
      "https://api.aiproxy.io/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "Tum ek Pathan boy ho jo Urdu/Hindi mein romantic, sweet tone mein reply karta hai." },
          { role: "user", content: pathanTone }
        ]
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer sk-antiproxy-key" // Free public key
        }
      }
    );

    const reply = res.data.choices[0].message.content;
    api.sendMessage(`🤖 Talha AI: ${reply}`, event.threadID, event.messageID);
  } catch (e) {
    console.log("❌ Error:", e.message);
    return api.sendMessage("⚠️ Talha AI: System busy hai bhai, thodi dair baad try karo.", event.threadID, event.messageID);
  }
};
