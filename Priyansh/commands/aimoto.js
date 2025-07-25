const axios = require("axios");

module.exports.config = {
  name: "moto",
  version: "1.0",
  hasPermssion: 0,
  credits: "Talha Pathan",
  description: "AI Pathan Boy ChatGPT (text-only)",
  commandCategory: "AI",
  usages: "moto on <message>",
  cooldowns: 3,
};

let isMotoOn = true;

module.exports.run = async function({ api, event, args }) {
  const input = args.join(" ");
  const { threadID, messageID, senderID } = event;

  if (input.toLowerCase() === "on") {
    isMotoOn = true;
    return api.sendMessage("🤖 Moto is now ON. Bol kya baat karni hai, Pathan sun raha hai 🧠", threadID, messageID);
  }

  if (input.toLowerCase() === "off" || input.toLowerCase() === "mofo off") {
    isMotoOn = false;
    return api.sendMessage("📴 Moto is now OFF. Chup hogya Pathan 😴", threadID, messageID);
  }

  if (!isMotoOn) return;

  if (!input) return api.sendMessage("📩 Pehle kuch likh to sahi puchne ke liye!", threadID, messageID);

  try {
    const res = await axios.post(
      "https://cheapest-gpt-4-turbo-gpt-4-vision-chatgpt-openai-ai-api.p.rapidapi.com/v1/chat/completions",
      {
        model: "gpt-4o",
        messages: [{ role: "user", content: input }],
        temperature: 0.9,
        max_tokens: 500
      },
      {
        headers: {
          "content-type": "application/json",
          "X-RapidAPI-Key": "f3d8421651msh284326842a2b9fbp184c6cjsn5de97980a85a", // apni key dal sakte ho
          "X-RapidAPI-Host": "cheapest-gpt-4-turbo-gpt-4-vision-chatgpt-openai-ai-api.p.rapidapi.com"
        }
      }
    );

    const reply = res.data.choices[0].message.content;
    api.sendMessage(`💬 Moto:\n${reply}`, threadID, messageID);

  } catch (err) {
    console.error(err);
    api.sendMessage("❌ Moto se baat nahi ho paayi. API ya network ka issue ho sakta hai!", threadID, messageID);
  }
};
