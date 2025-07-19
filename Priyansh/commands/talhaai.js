const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.config = {
  name: "talhaai",
  version: "2.0",
  hasPermssion: 0,
  credits: "Talha Pathan",
  description: "Talha AI with Guaranteed Voice Reply",
  commandCategory: "AI",
  usages: "[question]",
  cooldowns: 5
};

module.exports.run = async function({ api, event, args }) {
  const question = args.join(" ");
  if (!question) return api.sendMessage("🤖 Talha AI: Kuch poocho na bhai!", event.threadID);

  try {
    // Step 1: Get AI response (using reliable API)
    const { data } = await axios.get(`https://api.ibeng.tech/api/others/chatgpt?q=${encodeURIComponent(question)}&apikey=tamann`);
    const answer = data.data || "Maaf karo, abhi jawab nahi de pa raha";

    // Step 2: Convert to voice (using backup TTS services)
    let voiceUrl;
    
    // Try primary TTS service
    try {
      const tts1 = await axios.get(`https://api.tts.quest/v3/voicevox/audio?text=${encodeURIComponent(answer)}&speaker=3`);
      if (tts1.data.success) voiceUrl = tts1.data.mp3StreamingUrl;
    } catch (e) {}
    
    // If primary fails, try backup
    if (!voiceUrl) {
      const tts2 = await axios.get(`https://api.play.auroraofficial.tech/api/voicevox?text=${encodeURIComponent(answer)}`);
      voiceUrl = tts2.data.url;
    }

    // Step 3: Download and send voice
    const voicePath = path.join(__dirname, 'cache', 'talha_voice.mp3');
    const response = await axios.get(voiceUrl, { responseType: 'arraybuffer' });
    fs.writeFileSync(voicePath, Buffer.from(response.data));
    
    return api.sendMessage({
      body: `🗣️ Talha AI:\n\n${answer}`,
      attachment: fs.createReadStream(voicePath)
    }, event.threadID, () => fs.unlinkSync(voicePath));

  } catch (error) {
    console.error("Talha AI Error:", error);
    // Final fallback - text only
    return api.sendMessage(`🤖 Talha AI (Text):\n\n${answer || "Abhi response nahi de pa raha"}`, event.threadID);
  }
};
