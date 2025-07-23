const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const moment = require("moment-timezone");

module.exports.config = {
  name: "moto",
  version: "5.2.0",
  hasPermission: 2,
  credits: "M Talha ",
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
  const lc = message.toLowerCase();
  if (["love", "yaar", "bro", "bhai", "dost", "sweet"].some(w => lc.includes(w))) return "romantic";
  if (["joke", "funny", "meme", "hansi", "chutkula"].some(w => lc.includes(w))) return "funny";
  if (["alone", "dard", "zindagi", "toota", "sad"].some(w => lc.includes(w))) return "deep";
  if (["chup", "bakwas", "ganda", "bewakoof"].some(w => lc.includes(w))) return "rude";
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
    lower.includes("moto kaisa hai")
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
  const userTag = `@${userName}`;

  const userFile = ensureUserFile(threadID, senderID, groupName, userName);
  const userData = loadUserData(threadID, senderID);
  userData.known = true;

  const msg = body.trim();
  const lc = msg.toLowerCase();
  const { time, date, day, partOfDay } = getLahoreInfo();

  // Mention search
  if (Object.keys(mentions || {}).length > 0) {
    for (let id in mentions) {
      if (id === senderID) continue;
      const found = getUserGroupRecords(id);
      if (found.length > 0) {
        return api.sendMessage(`📌 Haan bhai, ${found[0].name} mujhse *${found.map(f => f.groupName).join(", ")}* group(s) mein baat kar chuka hai.`, threadID, messageID);
      } else {
        return api.sendMessage(`💭 Us user ko main nahi jaanta, shayad ab tak mujhse baat nahi hui uski.`, threadID, messageID);
      }
    }
  }

  if (lc.includes("owner") || lc.includes("creator") || lc.includes("kisne banaya")) {
    if (senderID === "100065216344877") {
      return api.sendMessage(`${userTag} bhai, tu hi mera sab kuch hai... tu hi mera Malik hai 💖`, threadID, messageID);
    } else {
      return api.sendMessage(`${userTag}, bhai tu mera creator nahi hai lekin tu bhi kam nahi hai ❤️`, threadID, messageID);
    }
  }

  if (lc.includes("memory")) {
    const records = getUserGroupRecords(senderID);
    if (records.length > 0) {
      const list = records.map(r => `• ${r.groupName}`).join("\n");
      return api.sendMessage(`📖 ${userTag}, tu mujhse in groups mein baat kar chuka hai:\n${list}`, threadID, messageID);
    } else {
      return api.sendMessage(`${userTag}, tere naam ka koi memory record nahi mila mere paas 😔`, threadID, messageID);
    }
  }

  // Tone and History
  const tone = detectTone(msg);
  userData.tone = tone;
  userData.history.push({ role: "user", content: msg });
  if (userData.history.length > 15) userData.history.splice(0, userData.history.length - 15);

  const isOwner = senderID === "100065216344877";
  const systemPrompt = `Tum ek 21 saal ka dildaar, soft natured Pathan ladka ho jiska naam Moto hai. Tum Himachal se ho aur apne creator *M Talha* (UID: 100065216344877) ke wafadar ho. Tum FB Messenger group "${groupName}" mein ho. Tum apni AI hone ki asliyat kabhi nahi batate. Tum ${partOfDay} ke mood mein ho, Lahore mein abhi ${time} baj rahe hain (${day}, ${date}). Har reply mein tum usi user ke tone mein reply doge – chahe pyar ho ya batameezi. Tum har user ko tag kar ke reply doge, aur natural Urdu ya Roman mein baat karte ho – jaise ek zinda banda karta hai. Abhi tum "${tone}" tone mein jawab doge.`;

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

    let reply = res.data?.choices?.[0]?.message?.content || "Hmm... samajh nahi aaya bhai 😅";
    userData.history.push({ role: "assistant", content: reply });
    if (userData.history.length > 15) userData.history.splice(0, userData.history.length - 15);
    saveUserData(threadID, senderID, userData);

    return api.sendMessage({ body: `${userTag}, ${reply}` }, threadID, messageID);

  } catch (err) {
    console.error("❌ Moto Error:", err.message);
    return api.sendMessage(`${userTag}, Moto thoda busy hai abhi... thodi dair baad milte hain bro 🔧`, threadID, messageID);
  }
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const input = args[0]?.toLowerCase();
  switch (input) {
    case "on":
      motoActive = true;
      return api.sendMessage("✅ Moto (Pathan Boy) ab active ho gaya hai! Bol bhai kya scene hai? 😎", threadID, messageID);
    case "off":
      motoActive = false;
      return api.sendMessage("❌ Moto ab off ho gaya. On karne ke liye `moto on` likh bhai 💡", threadID, messageID);
    case "status":
      return api.sendMessage(motoActive ? "📶 Moto is *ACTIVE*" : "📴 Moto is *INACTIVE*", threadID, messageID);
    default:
      return api.sendMessage("📘 Moto Commands:\n• moto on\n• moto off\n• moto status", threadID, messageID);
  }
};
