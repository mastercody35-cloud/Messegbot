const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.config = {
  name: "talhaai",
  version: "1.0",
  hasPermssion: 0,
  credits: "Talha Pathan",
  description: "Talha AI with Voice Reply (Hindi/Urdu/English)",
  commandCategory: "AI",
  usages: "[question]",
  cooldowns: 5
};

module.exports.run = async function({ api, event, args }) {
  const question = args.join(" ");
  if (!question) return api.sendMessage("🤖 Talha AI: Kuch poocho na bhai!", event.threadID);

  try {
    // Step 1: Get AI response (using Simsimi API)
    const { data } = await axios.get(`https://api.azz.biz.id/api/simsimi?q=${encodeURIComponent(question)}&key=global`);
    const answer = data.respon || "Maaf karo, samajh nahi aaya";

    // Step 2: Convert to voice (using VoiceVox TTS)
    const voice = await axios.get(`https://api.tts.quest/v3/voicevox/audio?text=${encodeURIComponent(answer)}&speaker=3`, {
      timeout: 20000
    });

    if (!voice.data.success) {
      return api.sendMessage(`🗣️ Talha AI (Text):\n\n${answer}`, event.threadID);
    }

    // Step 3: Download and send voice
    const voicePath = path.join(__dirname, 'cache', 'talha_voice.mp3');
    const response = await axios.get(voice.data.mp3StreamingUrl, {
      responseType: 'arraybuffer'
    });
    
    fs.writeFileSync(voicePath, Buffer.from(response.data));
    
    return api.sendMessage({
      body: `🗣️ Talha AI:\n\n${answer}`,
      attachment: fs.createReadStream(voicePath)
    }, event.threadID, () => fs.unlinkSync(voicePath));

  } catch (error) {
    console.error(error);
    return api.sendMessage("❌ Talha AI ko technical problem ho raha hai", event.threadID);
  }
};
