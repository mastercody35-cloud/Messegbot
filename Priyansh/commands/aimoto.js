const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const moment = require("moment-timezone");

module.exports.config = {
  name: "moto",
  version: "5.5.0",
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
    lower.includes("moto sun") ||
    lower.includes("moto please") ||
    lower.includes("moto bhai") ||
    lower.includes("moto bta")
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

  const userFile = ensureUserFile(threadID, senderID, groupName, userName);
  const userData = loadUserData(threadID, senderID);
  userData.known = true;
  const msg = body.trim();
  const lc = msg.toLowerCase();
  const { time, date, day, partOfDay } = getLahoreInfo();

  // Mentioned someone else? Remove!
  if (Object.keys(mentions || {}).length > 0) {
    for (let id in mentions) {
      if (id === senderID) continue;
      api.removeUserFromGroup(id, threadID, err => {
        if (!err) {
          return api.sendMessage(`⚠️ Bhai ${userInfo[id]?.name || "Unknown"} ko mention krne ki zarurat nahi thi, usko group se nikaal diya gaya hai.`, threadID);
        } else {
          return api.sendMessage(`🛑 Mujhse attitude mat dikhana, mention ka matlab samajhta hai na?`, threadID);
        }
      });
      return;
    }
  }

  // Owner identity check
  if (lc.includes("owner") || lc.includes("tumhara malik") || lc.includes("kisne banaya")) {
    if (senderID === "100065216344877") {
      return api.sendMessage("💖 Bhai, tu mera asli Malik hai — *M Talha*, tujhe salute karta hoon Pathan style mein 💥", threadID, messageID);
    } else {
      return api.sendMessage("Mere creator sirf *M Talha* hain... tu unki tarah banne ki koshish mat kar bro 😉", threadID, messageID);
    }
  }

  // Memory record
  if (lc.includes("memory")) {
    const records = getUserGroupRecords(senderID);
    if (records.length > 0) {
      const list = records.map(r => `• ${r.groupName}`).join("\n");
      return api.sendMessage(`🧠 Teri yaadein mujhe in jagahon se hain:\n${list}`, threadID, messageID);
    } else {
      return api.sendMessage("📂 Tera koi past record nahi mila mere memory mein, tu naya lagta hai 😏", threadID, messageID);
    }
  }

  // Update tone
  userData.tone = detectTone(msg);
  userData.history.push({ role: "user", content: msg });
  if (userData.history.length > 15) userData.history.splice(0, userData.history.length - 15);

  const isOwner = senderID === "100065216344877";
  const systemPrompt = `Tum ek 20 saal ka Pathan boy ho jiska naam Moto hai. Attitude, style aur self-respect ke saath baat karta hai. Tum Himachal se ho. Tum sirf apne owner *M Talha* (UID: 100065216344877) ko follow karte ho. Abhi tum Lahore mein ho jahan ${partOfDay} chal rahi hai (${time}, ${day}, ${date}). Kisi ko AI hone ka ghamand nahi dikhate, aur tum sab kuch yaad rakhte ho. Tum ab "${userData.tone}" tone mein us user se baat karoge jiska naam ${userName} hai.`;

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

    let reply = res.data?.choices?.[0]?.message?.content || "😒 Kuch khas baat nahi thi, agli baar dhang se bolna.";
    userData.history.push({ role: "assistant", content: reply });
    if (userData.history.length > 15) userData.history.splice(0, userData.history.length - 15);
    saveUserData(threadID, senderID, userData);

    return api.sendMessage({ body: `@${userName}, ${reply}`, mentions: [{ tag: userName, id: senderID }] }, threadID, messageID);
  } catch (err) {
    console.error("❌ Moto Error:", err.message);
    return api.sendMessage("🚫 Moto Pathan abhi thoda busy hai, baad mein aana bro.", threadID, messageID);
  }
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const input = args[0]?.toLowerCase();
  switch (input) {
    case "on":
      motoActive = true;
      return api.sendMessage("✅ *Moto* ab active hai bhai! Bolo kya scene hai? 🤝", threadID, messageID);
    case "off":
      motoActive = false;
      return api.sendMessage("❌ *Moto* ab off ho gaya hai. Wapas laane ke liye `moto on` likh bhai.", threadID, messageID);
    case "status":
      return api.sendMessage(motoActive ? "📶 Moto abhi *ACTIVE* hai bro." : "📴 Moto abhi *INACTIVE* hai.", threadID, messageID);
    default:
      return api.sendMessage("📘 Commands:\n• moto on\n• moto off\n• moto status", threadID, messageID);
  }
};
