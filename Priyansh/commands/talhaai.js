const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.config = {
  name: "talhaai",
  version: "3.1",
  hasPermssion: 0,
  credits: "Talha Pathan",
  description: "Improved Talha AI Voice Assistant",
  commandCategory: "AI",
  usages: "[question]",
  cooldowns: 5
};

module.exports.run = async function({ api, event, args }) {
  const question = args.join(" ");
  if (!question) return api.sendMessage("🤖 Talha AI: Kuch poocho na bhai!", event.threadID, event.messageID);

  try {
    // Step 1: Get AI response using more reliable API
    const aiResponse = await axios.get(`https://api.ainz-sama.xyz/api/gpt4?query=${encodeURIComponent(question)}`);
    const answer = aiResponse.data.response || "Abhi jawab dene mein thodi problem ho rahi hai";

    // Step 2: Convert to voice using reliable TTS
    const ttsResponse = await axios.get(`https://api.tts.quest/v3/voicevox/synthesis?text=${encodeURIComponent(answer)}&speaker=3`, {
      responseType: 'arraybuffer'
    });

    const voicePath = path.join(__dirname, 'cache', 'talha_voice.mp3');
    fs.writeFileSync(voicePath, ttsResponse.data);

    // Step 3: Send both text and voice
    api.sendMessage({
      body: `🗣️ Talha AI:\n\n${answer}`,
      attachment: fs.createReadStream(voicePath)
    }, event.threadID, () => {
      fs.unlinkSync(voicePath);
    }, event.messageID);

  } catch (error) {
    console.error("Error:", error);
    // Fallback to text-only response if voice fails
    try {
      const fallbackResponse = await axios.get(`https://api.ainz-sama.xyz/api/gpt4?query=${encodeURIComponent(question)}`);
      api.sendMessage(`🤖 Talha AI (Text Only):\n\n${fallbackResponse.data.response || "Abhi technical issue chal raha hai"}`, event.threadID, event.messageID);
    } catch (e) {
      api.sendMessage("🤖 Talha AI: Abhi thodi technical problem chal rahi hai, thodi der baad try karna", event.threadID, event.messageID);
    }
  }
};
