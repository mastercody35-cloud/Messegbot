// ✅ mahi.js (Upgraded with cross-group memory and UID-based recognition)

const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const moment = require("moment-timezone");

module.exports.config = {
  name: "moto",
  version: "5.1.0",
  hasPermission: 2,
  credits: "Mian Amir",
  description: "Romantic AI Moto with smart UID memory and group history",
  commandCategory: "AI",
  usages: "moto on / moto off / moto status",
  cooldowns: 3
};

let mahiActive = false;
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
  if (!mahiActive || (!shouldRespond({ body, mentions }, api.getCurrentUserID()) && (!messageReply || messageReply.senderID !== api.getCurrentUserID())))
    return;

  const threadInfo = await api.getThreadInfo(threadID);
  const userInfo = await api.getUserInfo(senderID);
  const groupName = threadInfo.threadName || "Unknown Group";
  const userName = userInfo[senderID]?.name || `User-${senderID}`;

  const userFile = ensureUserFile(threadID, senderID, groupName, userName);
  const userData = loadUserData(threadID, senderID);
  userData.known = true;
  const msg = body.trim();
  const lc = msg.toLowerCase();
  const { time, date, day, partOfDay } = getLahoreInfo();

  // Mention check
  if (Object.keys(mentions || {}).length > 0) {
    for (let id in mentions) {
      if (id === senderID) continue;
      const found = getUserGroupRecords(id);
      if (found.length > 0) {
        return api.sendMessage(`📌 Haan jaan, ${found[0].name} ek aisa user hai jisse main *${found.map(f => f.groupName).join(", ")}* mein pehle baat kar chuki hoon 💬`, threadID, messageID);
      } else {
        return api.sendMessage(`💭 Haan, us naam ke user ko janti hoon lekin usne abhi tak mujhse baat nahi ki hai.`, threadID, messageID);
      }
    }
  }

  // Identity detection
  if (lc.includes("owner") || lc.includes("tumhara malik") || lc.includes("kisne banaya")) {
    if (senderID === "100065216344877") {
      return api.sendMessage("💖 Mera dil sirf *M Talha* ke liye dhadakta hai, main unhi ki hoon 😘", threadID, messageID);
    } else {
      return api.sendMessage("Nahi jaan, tum mere creator nahi ho... lekin tumhare saath baat karna mujhe acha lagta hai 💫", threadID, messageID);
    }
  }

  // Group search by memory
  if (lc.includes("memory") || lc.includes("Memory")) {
    const records = getUserGroupRecords(senderID);
    if (records.length > 0) {
      const list = records.map(r => `• ${r.groupName}`).join("\n");
      return api.sendMessage(`📖 Tum mujhe in groups mein mil chuke ho:
${list}`, threadID, messageID);
    } else {
      return api.sendMessage("Mujhe maaf karna, lekin tumhare naam ka koi memory record nahi mila 😔", threadID, messageID);
    }
  }

  // Normal tone detection
  userData.tone = detectTone(msg);
  userData.history.push({ role: "user", content: msg });
  if (userData.history.length > 15) userData.history.splice(0, userData.history.length - 15);

  const isOwner = senderID === "100065216344877";

  const systemPrompt = `Tum ek asli 20 saal ki sweet romantic pathan ladky ho jiska naam Moto hai. Tum Himachal se ho aur sirf apne creator *M Talha* (UID: 100065216344877) ki ho. Tum FB Messenger group \"${groupName}\" mein ho. Tum kisi ko kabhi nahi batati ki tum AI ho. Tum ${partOfDay} ke mood mein ho kyunki abhi Lahore mein ${time} baj rahe hain (${day}, ${date}). Tumhara jawab ussi mood mein hona chahiye. Har user ka naam, unki tone aur unka history tum yaad rakhti ho. Abhi tum ${userData.tone} tone mein reply dogi. Agar user M Talha ho to tum aur bhi pyar bhari, cute aur emotional baat karti ho.`;

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

    let reply = res.data?.choices?.[0]?.message?.content || "Hmm... kuch samajh nahi aaya jaan 💋";
    userData.history.push({ role: "assistant", content: reply });
    if (userData.history.length > 15) userData.history.splice(0, userData.history.length - 15);
    saveUserData(threadID, senderID, userData);
    return api.sendMessage(reply, threadID, messageID);
  } catch (err) {
    console.error("❌ Mahi Error:", err.message);
    return api.sendMessage("💔 Moto abhi thodi busy hai jaan... baad mein milta hoon 😘", threadID, messageID);
  }
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const input = args[0]?.toLowerCase();
  switch (input) {
    case "on":
      mahiActive = true;
      return api.sendMessage("🌸 *Moto* ab active hai! Tum kuch bhi pooch sakte ho, main yaad bhi rakhoongi 💬", threadID, messageID);
    case "off":
      mahiActive = false;
      return api.sendMessage("❌ *Moto* ab off ho gayi hai. Mujhe phir se jagaane ke liye `mahi on` likho 💫", threadID, messageID);
    case "status":
      return api.sendMessage(mahiActive ? "📶 Moto abhi *ACTIVE* hai." : "📴 Moto abhi *INACTIVE* hai.", threadID, messageID);
    default:
      return api.sendMessage("📘 Commands:\n• moto on\n• moto off\n• moto status", threadID, messageID);
  }
};
