const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.config = {
  name: "talhaai",
  version: "3.5",
  hasPermssion: 0,
  credits: "Talha Pathan",
  description: "Smart Talha AI with Voice",
  commandCategory: "AI",
  usages: "[question]",
  cooldowns: 5
};

module.exports.run = async function({ api, event, args }) {
  const question = args.join(" ");
  if (!question) return api.sendMessage("🤖 Talha AI: Kuch to pooch bhai!", event.threadID, event.messageID);

  const cacheDir = path.join(__dirname, 'cache');
  if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir); // Ensure cache folder exists

  try {
    // Get AI response
    const aiRes = await axios.get(`https://api.ainz-sama.xyz/api/gpt4?query=${encodeURIComponent(question)}`);
    const answer = aiRes?.data?.response || "Talha AI: Jawab nahi mila bhai.";

    // Get voice from TTS
    const ttsRes = await axios.get(`https://api.tts.quest/v3/voicevox/synthesis?text=${encodeURIComponent(answer)}&speaker=14`, {
      responseType: 'arraybuffer'
    });

    const filePath = path.join(cacheDir, 'talha_voice.mp3');
    fs.writeFileSync(filePath, ttsRes.data);

    // Send voice and text
    api.sendMessage({
      body: `🎙️ Talha AI:\n\n${answer}`,
      attachment: fs.createReadStream(filePath)
    }, event.threadID, () => fs.unlinkSync(filePath), event.messageID);

  } catch (err) {
    console.log("❌ TalhaAI Error:", err.message);
    // If voice fails, send only text
    try {
      const fallback = await axios.get(`https://api.ainz-sama.xyz/api/gpt4?query=${encodeURIComponent(question)}`);
      const fallbackText = fallback?.data?.response || "Talha AI: Abhi kuch masla hai, text hi bhej raha hoon.";
      return api.sendMessage(`📩 Talha AI (Text Only):\n\n${fallbackText}`, event.threadID, event.messageID);
    } catch (e) {
      return api.sendMessage("⚠️ Talha AI: System busy hai bhai, thodi dair baad try karo.", event.threadID, event.messageID);
    }
  }
};
