const axios = require("axios");
const fs = require("fs");
const path = require("path");

const togglePath = path.join(__dirname, "newmoto_toggle.json");
const userDataPath = path.join(__dirname, "newmoto_users.json");

// Initialize toggle file if not exists
if (!fs.existsSync(togglePath)) {
  fs.writeFileSync(togglePath, JSON.stringify({ enabled: false }, null, 2));
}

// Initialize user data file if not exists
if (!fs.existsSync(userDataPath)) {
  fs.writeFileSync(userDataPath, JSON.stringify([], null, 2));
}

module.exports.config = {
  name: "newmoto",
  version: "3.2.0",
  hasPermission: 0,
  credits: "Faheem Akhtar",
  description: "Reply to moto or bot reply triggers (global on/off)",
  commandCategory: "AI",
  usages: "[on/off]",
  cooldowns: 2,
};

module.exports.handleEvent = async function ({ api, event }) {
  try {
    const toggle = JSON.parse(fs.readFileSync(togglePath));
    if (!toggle.enabled) return;

    const botID = api.getCurrentUserID();
    const messageText = (event.body || "").toLowerCase();

    const isChuzaTrigger =
      messageText.includes("moto") ||
      messageText.includes("oye moto") ||
      messageText.includes("suno moto");

    const isReplyToBot =
      event.messageReply && event.messageReply.senderID === botID;

    if (!isChuzaTrigger && !isReplyToBot) return;

    // Fetch sender name
    const senderInfo = await api.getUserInfo(event.senderID);
    const senderName = senderInfo?.[event.senderID]?.name || "bhai";

    // Prefix options
    const prefixes = [
      "Haan",
      "Oye",
      "Abey",
      "Wow Yaar",
      "Ary",
      "Ary Yaar",
      "O Bhai",
      "Sun Zara",
    ];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];

    // AI request
    const res = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "nousresearch/hermes-3-llama-3.1-70b",
        messages: [
          {
            role: "system",
            content:
              "Tum ek desi Urdu/Hindi AI ho. Jab koi 'moto' ya bot ko reply kare, to tu usko sadak-chaap, taunting, funny, ya mooh tod reply de. Bold gali tone bhi acceptable hai, lekin entertaining style mein.",
          },
          {
            role: "user",
            content: messageText || "moto",
          },
        ],
        temperature: 0.9,
        max_tokens: 300,
      },
      {
        headers: {
          Authorization:
            "Bearer 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",
          "Content-Type": "application/json",
        },
      }
    );

    const aiReply =
      res?.data?.choices?.[0]?.message?.content?.trim() ||
      "Tu kya bol raha hai moto?";

    // Log user interaction
    const userLog = JSON.parse(fs.readFileSync(userDataPath));
    userLog.push({
      uid: event.senderID,
      name: senderName,
      message: messageText,
      ai: aiReply,
      threadID: event.threadID,
      time: new Date().toLocaleString("en-PK", { timeZone: "Asia/Karachi" }),
    });
    fs.writeFileSync(userDataPath, JSON.stringify(userLog, null, 2));

    return api.sendMessage(
      `${prefix} ${senderName}, ${aiReply}`,
      event.threadID,
      event.messageID
    );
  } catch (err) {
    console.error("❌ newmoto error:", err.message || err);
  }
};

module.exports.run = function ({ api, event, args }) {
  const toggle = JSON.parse(fs.readFileSync(togglePath));
  const status = args[0]?.toLowerCase();

  if (status === "on") {
    toggle.enabled = true;
    fs.writeFileSync(togglePath, JSON.stringify(toggle, null, 2));
    return api.sendMessage(
      "✅ newmoto globally ON ho gaya bhai.",
      event.threadID,
      event.messageID
    );
  }

  if (status === "off") {
    toggle.enabled = false;
    fs.writeFileSync(togglePath, JSON.stringify(toggle, null, 2));
    return api.sendMessage(
      "❌ newmoto globally OFF kar diya gaya bhai.",
      event.threadID,
      event.messageID
    );
  }

  return api.sendMessage(
    "📌 Use: .newmoto on/off",
    event.threadID,
    event.messageID
  );
};
