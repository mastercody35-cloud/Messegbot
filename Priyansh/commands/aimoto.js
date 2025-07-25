const axios = require("axios");
const fs = require("fs-extra");
const gTTS = require("gtts");
const path = require("path");

module.exports.config = {
  name: "moto",
  version: "2.0",
  hasPermssion: 0,
  credits: "Talha Pathan",
  description: "AI + Voice Urdu Reply using GPT",
  commandCategory: "AI",
  usages: "moto on <text>",
  cooldowns: 3
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, senderID } = event;

  if (!args[0]) return api.sendMessage("💡 Use: moto on <your message>\nExample: moto on tum kon ho?", threadID, messageID);

  const input = args.join(" ");
  const uid = senderID;
  const fileName = path.join(__dirname, `/cache/moto-${uid}.mp3`);

  // OFF MODE
  if (input.toLowerCase().startsWith("off") || input.toLowerCase() === "mofo off") {
    return api.sendMessage(`😒 Moto off kar diya gaya hai, Talha bhai ke hukum pe!`, threadID, messageID);
  }

  // ON MODE: AI GPT + Voice
  const userMessage = input.replace(/^on/i, "").trim();
  if (!userMessage) return api.sendMessage("❓ Kuch to likho moto ko reply dene ke liye!", threadID, messageID);

  api.sendMessage("⏳ Moto soch raha hai...", threadID);

  try {
    const gptRes = await axios.post("https://cheapest-gpt-4-turbo-gpt-4-vision-chatgpt-openai-ai-api.p.rapidapi.com/v1/chat/completions",
      {
        messages: [{ role: "user", content: userMessage }],
        model: "gpt-4o",
        max_tokens: 100,
        temperature: 0.8
      },
      {
        headers: {
          "content-type": "application/json",
          "x-rapidapi-host": "cheapest-gpt-4-turbo-gpt-4-vision-chatgpt-openai-ai-api.p.rapidapi.com",
          "x-rapidapi-key": "f3d8421651msh284326842a2b9fbp184c6cjsn5de97980a85a"
        }
      });

    const aiReply = gptRes.data.choices[0].message.content;
    const finalReply = `💬 Moto:\n${aiReply}`;

    // Convert to Voice (Hindi/Urdu feel)
    const gtts = new gTTS(aiReply, "hi");
    await new Promise((resolve, reject) => {
      gtts.save(fileName, err => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Send voice + message
    await api.sendMessage({ body: finalReply, attachment: fs.createReadStream(fileName) }, threadID, () => {
      fs.unlinkSync(fileName); // delete temp file
    }, messageID);

  } catch (err) {
    console.error(err);
    return api.sendMessage("❌ Moto reply failed. API key sahi hai kya?", threadID, messageID);
  }
};
