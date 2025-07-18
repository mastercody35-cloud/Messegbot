const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "moto",
  version: "1.0",
  hasPermssion: 0,
  credits: "Talha ",
  description: "Ask AI anything, get voice reply",
  commandCategory: "AI",
  usages: "[question]",
  cooldowns: 3
};

module.exports.run = async function ({ api, event, args }) {
  const question = args.join(" ");
  if (!question) return api.sendMessage("🤖 | Moto kya bole? Sawal to pocho!", event.threadID);

  try {
    // 1. Get AI reply from ChatGPT (or OpenAI API)
    const chatReply = await axios.post("https://gpt4free.vercel.app/v1/chat/completions", {
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: question }]
    }, {
      headers: { "Authorization": "Bearer FREE-TOKEN" } // <-- Replace with your real API key
    });

    const answer = chatReply.data.choices[0].message.content;
    if (!answer) return api.sendMessage("❌ | Moto confused hogya...", event.threadID);

    // 2. Convert reply to voice using free TTS
    const ttsURL = `https://api.tts.quest/v3/voice?text=${encodeURIComponent(answer)}&lang=en`;
    const ttsRes = await axios.get(ttsURL);
    const audioUrl = ttsRes.data?.mp3;

    if (!audioUrl) return api.sendMessage("❌ | Moto bol nahi paya. Try again.", event.threadID);

    const filepath = path.join(__dirname, `/cache/moto.mp3`);
    const audio = await axios.get(audioUrl, { responseType: "arraybuffer" });
    fs.writeFileSync(filepath, Buffer.from(audio.data, "utf-8"));

    return api.sendMessage({
      body: `🎤 Moto says: ${answer}`,
      attachment: fs.createReadStream(filepath)
    }, event.threadID, () => fs.unlinkSync(filepath));

  } catch (err) {
    console.error("Moto Error:", err.message);
    return api.sendMessage("❌ | Error aagya Moto me.", event.threadID);
  }
};
