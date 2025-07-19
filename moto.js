const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "moto",
  version: "2.0",
  hasPermssion: 0,
  credits: "Talha",
  description: "AI assistant with voice reply",
  commandCategory: "AI",
  usages: "[question]",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  const question = args.join(" ");
  if (!question) return api.sendMessage("🤖 Moto kya bole? Kuch to pucho!", event.threadID, event.messageID);

  try {
    // Step 1: Get AI text response
    const aiResponse = await axios.get(`https://api.azz.biz.id/api/simsimi?q=${encodeURIComponent(question)}&key=global`);
    const answer = aiResponse.data?.respon || "Moto samajh nahi paya, phir se try karo";

    // Step 2: Convert text to speech
    const voiceResponse = await axios.get(`https://api.tts.quest/v3/voicevox/audio?text=${encodeURIComponent(answer)}&speaker=3`, {
      timeout: 30000
    });

    if (!voiceResponse.data?.success) {
      return api.sendMessage({
        body: `🤖 Moto (text only): ${answer}\n\n⚠ Voice service unavailable right now`
      }, event.threadID, event.messageID);
    }

    // Step 3: Download the audio
    const audioUrl = voiceResponse.data.mp3StreamingUrl;
    const filePath = path.join(__dirname, 'cache', 'moto_voice.mp3');
    
    const audioFile = await axios.get(audioUrl, {
      responseType: 'arraybuffer',
      timeout: 30000
    });

    fs.writeFileSync(filePath, Buffer.from(audioFile.data));

    // Step 4: Send the voice message
    return api.sendMessage({
      body: `🎤 Moto says:\n\n${answer}`,
      attachment: fs.createReadStream(filePath)
    }, event.threadID, () => {
      try {
        fs.unlinkSync(filePath);
      } catch (e) {
        console.log("Error deleting file:", e);
      }
    }, event.messageID);

  } catch (error) {
    console.error("Moto Error:", error);
    return api.sendMessage("❌ Moto ko thodi problem ho rahi hai... Thodi der baad try karna", event.threadID, event.messageID);
  }
};
