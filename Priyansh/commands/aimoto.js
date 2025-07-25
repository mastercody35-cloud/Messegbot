const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const moment = require("moment-timezone");

module.exports.config = {
  name: "moto",
  version: "5.2.0",
  hasPermission: 2,
  credits: "M Talha",
  description: "AI Pathan Boy Moto with smart UID memory and tone-based replies",
  commandCategory: "AI",
  usages: "moto on / moto off / moto status",
  cooldowns: 3
};

let motoActive = false;
const memoryBase = path.join(__dirname, "memory");

function ensureUserFile(groupID, userID, groupName, userName) {
  const groupFolder = path.join(memoryBase, groupID);
  fs.ensureDirSync(groupFolder);
  const filePath = path.join(groupFolder, `${userID}.json`);
  if (!fs.existsSync(filePath)) {
    fs.writeJsonSync(filePath, {
      name: userName,
      tone: "normal",
      history: [],
      known: false,
      group: groupName
    }, { spaces: 2 });
  }
  return filePath;
}

function loadUserData(groupID, userID) {
  const filePath = path.join(memoryBase, groupID, `${userID}.json`);
  return fs.existsSync(filePath) ? fs.readJsonSync(filePath) : null;
}

function saveUserData(groupID, userID, data) {
  const filePath = path.join(memoryBase, groupID, `${userID}.json`);
  fs.writeJsonSync(filePath, data, { spaces: 2 });
}

function getUserGroupRecords(uid) {
  const folders = fs.readdirSync(memoryBase);
  const results = [];
  for (const folder of folders) {
    const file = path.join(memoryBase, folder, `${uid}.json`);
    if (fs.existsSync(file)) {
      const data = fs.readJsonSync(file);
      results.push({ groupID: folder, groupName: data.group || "Unknown Group", name: data.name });
    }
  }
  return results;
}

function getLahoreInfo() {
  const time = moment().tz("Asia/Karachi");
  const hour = time.hour();
  let partOfDay = "raat";
  if (hour >= 5 && hour < 12) partOfDay = "subah";
  else if (hour >= 12 && hour < 17) partOfDay = "dupehar";
  else if (hour >= 17 && hour < 21) partOfDay = "shaam";
  return {
    time: time.format("h:mm A"),
    day: time.format("dddd"),
    date: time.format("MMMM Do YYYY"),
    partOfDay
  };
}

function detectTone(message) {
  const romantic = ["love", "jaan", "baby", "sweetheart"];
  const funny = ["joke", "fun", "hasna", "meme"];
  const deep = ["zindagi", "dard", "alone", "emotional"];
  const lc = message.toLowerCase();
  if (romantic.some(word => lc.includes(word))) return "romantic";
  if (funny.some(word => lc.includes(word))) return "funny";
  if (deep.some(word => lc.includes(word))) return "deep";
  return "normal";
}

function shouldRespond({ body, mentions }, botID) {
  if (!body) return false;
  const lower = body.toLowerCase();
  return (
    mentions?.[botID] ||
    lower.includes("moto") ||
    lower.startsWith("@moto") ||
    lower.includes("moto tum") ||
    lower.includes("moto please") ||
    lower.includes("moto love") ||
    lower.includes("moto kasy ho")
  );
}

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, senderID, body, mentions, messageID, messageReply } = event;
  if (!motoActive || (!shouldRespond({ body, mentions }, api.getCurrentUserID()) && (!messageReply || messageReply.senderID !== api.getCurrentUserID())))
    return;

  const threadInfo = await api.getThreadInfo(threadID);
  const userInfo = await api.getUserInfo(senderID);
  const groupName = threadInfo.threadName || "Unknown Group";
  const userName = userInfo[senderID]?.name || `User-${senderID}`;
  const mentionTag = [{ id: senderID, tag: userName }];

  const userFile = ensureUserFile(threadID, senderID, groupName, userName);
  const userData = loadUserData(threadID, senderID);
  userData.known = true;

  const msg = body.trim();
  const lc = msg.toLowerCase();
  const { time, date, day, partOfDay } = getLahoreInfo();

  // Mention lookup
  if (Object.keys(mentions || {}).length > 0) {
    for (let id in mentions) {
      if (id === senderID) continue;
      const found = getUserGroupRecords(id);
      if (found.length > 0) {
        return api.sendMessage(`📌 Haan ${userName} bhai, ${found[0].name} mujhe *${found.map(f => f.groupName).join(", ")}* mein mila hai 💬`, threadID, messageID);
      } else {
        return api.sendMessage(`💭 Bhai, us naam ka banda mujhe yaad nahi hai... shayad abhi mulaqat nahi hui 😅`, threadID, messageID);
      }
    }
  }

  // Creator check
  if (lc.includes("owner") || lc.includes("tumhara malik") || lc.includes("kisne banaya")) {
    if (senderID === "100065216344877") {
      return api.sendMessage(`❤️ Mera dil sirf *M Talha* bhai ke liye dhadakta hai, main unka hi Moto hoon 😎`, threadID, messageID);
    } else {
      return api.sendMessage(`Nahi bhai jaan, mere creator sirf *M Talha* hain... par tumse baat karna bhi acha lagta hai 🤝`, threadID, messageID);
    }
  }

  // Group memory lookup
  if (lc.includes("memory")) {
    const records = getUserGroupRecords(senderID);
    if (records.length > 0) {
      const list = records.map(r => `• ${r.groupName}`).join("\n");
      return api.sendMessage(`📖 ${userName}, tum mujhe in groups mein mil chuke ho:\n${list}`, threadID, messageID);
    } else {
      return api.sendMessage(`${userName}, tumhare naam ka koi memory record nahi mila 😕`, threadID, messageID);
    }
  }

  userData.tone = detectTone(msg);
  userData.history.push({ role: "user", content: msg });
  if (userData.history.length > 15) userData.history.splice(0, userData.history.length - 15);

  const isOwner = senderID === "100065216344877";

  const systemPrompt = `Tum ek 20 saal ka asli Pathan ladka ho jiska naam *Moto* hai. Tum soft, sweet, respectful ho aur Himachal se ho. Tum sirf apne creator *M Talha* (UID: 100065216344877) ke ho. Tum FB group "${groupName}" mein ho. Kabhi bhi yeh mat kehna ke tum AI ho. Abhi ${partOfDay} ka time hai Lahore mein (${time}, ${day}, ${date}). Tumhare jawab ${userData.tone} mood mein hone chahiye. Agar baat M Talha se ho to tum aur zyada emotional aur pyare bano.`;

  const messages = [
    { role: "system", content: systemPrompt },
    ...userData.history
  ];

  try {
    const res = await axios.post("https://api.a4f.co/v1/chat/completions", {
      model: "provider-2/gpt-3.5-turbo",
      messages,
      temperature: 0.85
    }, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer ddc-a4f-58cf64b46fd84575a17c351b4dbc7da5"
      }
    });

    let reply = res.data?.choices?.[0]?.message?.content || "Bhai kuch samajh nahi aaya 😅";
    userData.history.push({ role: "assistant", content: reply });
    if (userData.history.length > 15) userData.history.splice(0, userData.history.length - 15);
    saveUserData(threadID, senderID, userData);

    return api.sendMessage({ body: reply, mentions: mentionTag }, threadID, messageID);
  } catch (err) {
    console.error("❌ Moto Error:", err.message);
    return api.sendMessage("⚠️ Moto abhi thoda busy hai bhai... baad mein milta hoon 💬", threadID, messageID);
  }
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const input = args[0]?.toLowerCase();
  switch (input) {
    case "on":
      motoActive = true;
      return api.sendMessage("✅ *Moto* ab active ho chuka hai bhai! Kuch bhi pucho, yaad bhi rakhta hoon 💬", threadID, messageID);
    case "off":
      motoActive = false;
      return api.sendMessage("❌ *Moto* ab off ho gaya hai. Jagaane ke liye `moto on` likho phir 🤖", threadID, messageID);
    case "status":
      return api.sendMessage(motoActive ? "📶 Moto abhi *ACTIVE* hai." : "📴 Moto abhi *INACTIVE* hai.", threadID, messageID);
    default:
      return api.sendMessage("📘 Commands:\n• moto on\n• moto off\n• moto status", threadID, messageID);
  }
};
