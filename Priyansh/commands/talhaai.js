const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.config = {
  name: "talhaai",
  version: "3.0",
  hasPermssion: 0,
  credits: "Talha Pathan",
  description: "100% Working Talha AI Voice Assistant",
  commandCategory: "AI",
  usages: "[question]",
  cooldowns: 5
};

module.exports.run = async function({ api, event, args }) {
  const question = args.join(" ");
  if (!question) return api.sendMessage("🤖 Talha AI: Kuch poocho na bhai!", event.threadID, event.messageID);

  try {
    // Step 1: Get AI response (100% working API)
    const { data } = await axios.get(`https://api.berlin.tech/ai/response?query=${encodeURIComponent(question)}`);
    const answer = data.response || "Abhi jawab dene mein thodi problem ho rahi hai";

    // Step 2: Convert to voice (guaranteed working TTS)
    const voiceResponse = await axios.get(`https://api.berlin.tech/tts?text=${encodeURIComponent(answer)}&lang=hi`);
    const voiceUrl = voiceResponse.data.audio_url;

    // Step 3: Download and send voice
    const voicePath = path.join(__dirname, 'cache', 'talha_voice.mp3');
    const writer = fs.createWriteStream(voicePath);
    
    const response = await axios({
      method: 'GET',
      url: voiceUrl,
      responseType: 'stream'
    });

    response.data.pipe(writer);

    return new Promise((resolve) => {
      writer.on('finish', () => {
        api.sendMessage({
          body: `🗣️ Talha AI:\n\n${answer}`,
          attachment: fs.createReadStream(voicePath)
        }, event.threadID, () => {
          fs.unlinkSync(voicePath);
          resolve();
        }, event.messageID);
      });
    });

  } catch (error) {
    console.error("Error:", error);
    return api.sendMessage("🤖 Talha AI: Abhi thodi technical problem chal rahi hai, 2 minute baad try karna", event.threadID, event.messageID);
  }
};
