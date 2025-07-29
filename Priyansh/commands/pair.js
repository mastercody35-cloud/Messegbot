module.exports.config = {
  name: "pair",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Fixed by Talha ✨",
  description: "Pair two people based on gender with romantic image",
  commandCategory: "fun",
  usages: "",
  cooldowns: 15,
  dependencies: {
    "axios": "",
    "fs-extra": "",
    "canvas": ""
  }
};

module.exports.run = async function ({ Users, Threads, api, event }) {
  const { loadImage, createCanvas } = require("canvas");
  const fs = global.nodemodule["fs-extra"];
  const axios = global.nodemodule["axios"];

  const pathImg = __dirname + "/cache/pair_bg.png";
  const pathAvt1 = __dirname + "/cache/pair1.png";
  const pathAvt2 = __dirname + "/cache/pair2.png";

  const id1 = event.senderID;
  const name1 = await Users.getNameUser(id1);
  const threadInfo = await api.getThreadInfo(event.threadID);
  const allUsers = threadInfo.userInfo;
  const botID = api.getCurrentUserID();

  // Get sender gender
  let gender1 = null;
  for (let user of allUsers) {
    if (user.id === id1) {
      gender1 = user.gender;
      break;
    }
  }

  // Get matching candidates
  let candidates = [];
  for (let user of allUsers) {
    if (user.id !== id1 && user.id !== botID && user.gender !== undefined) {
      if ((gender1 === "MALE" && user.gender === "FEMALE") ||
          (gender1 === "FEMALE" && user.gender === "MALE") ||
          (gender1 !== "MALE" && gender1 !== "FEMALE")) {
        candidates.push(user.id);
      }
    }
  }

  if (candidates.length === 0) {
    return api.sendMessage("⚠️ Group mein koi suitable match nahi mila bhai 😔", event.threadID, event.messageID);
  }

  // Pick random match
  const id2 = candidates[Math.floor(Math.random() * candidates.length)];
  const name2 = await Users.getNameUser(id2);

  // Get love percentage
  const funny = ["0", "-1", "99.99", "-100", "101", "0.01"];
  const real = Math.floor(Math.random() * 100) + 1;
  const chance = Math.random() < 0.9 ? real : funny[Math.floor(Math.random() * funny.length)];

  // Download avatars
  try {
    const avt1 = (
      await axios.get(`https://graph.facebook.com/${id1}/picture?width=720&height=720&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" })
    ).data;
    fs.writeFileSync(pathAvt1, Buffer.from(avt1, "utf-8"));

    const avt2 = (
      await axios.get(`https://graph.facebook.com/${id2}/picture?width=720&height=720&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" })
    ).data;
    fs.writeFileSync(pathAvt2, Buffer.from(avt2, "utf-8"));

    const bg = (
      await axios.get("https://i.imgur.com/FN4Wb6w.jpeg", { responseType: "arraybuffer" })
    ).data;
    fs.writeFileSync(pathImg, Buffer.from(bg, "utf-8"));

    // Create canvas
    const baseImg = await loadImage(pathImg);
    const avatar1 = await loadImage(pathAvt1);
    const avatar2 = await loadImage(pathAvt2);
    const canvas = createCanvas(baseImg.width, baseImg.height);
    const ctx = canvas.getContext("2d");

    // Draw background
    ctx.drawImage(baseImg, 0, 0, canvas.width, canvas.height);

    // Draw avatars
    ctx.drawImage(avatar1, 410, 600, 770, 795);
    ctx.drawImage(avatar2, 2080, 600, 770, 795);

    const imgBuffer = canvas.toBuffer();
    fs.writeFileSync(pathImg, imgBuffer);
    fs.unlinkSync(pathAvt1);
    fs.unlinkSync(pathAvt2);

    return api.sendMessage({
      body: `💞 𝗣𝗔𝗜𝗥 𝗠𝗔𝗧𝗖𝗛 💞\n━━━━━━━━━━━━━━\n👤 ${name1} ❤️ ${name2}\n💘 Love Chance: ${chance}%`,
      mentions: [{ tag: name2, id: id2 }],
      attachment: fs.createReadStream(pathImg)
    }, event.threadID, () => fs.unlinkSync(pathImg), event.messageID);

  } catch (err) {
    console.log("❌ Image/Canvas error:", err);
    return api.sendMessage(`✅ Pair ho gaya: ${name1} ❤️ ${name2}\n❌ Lekin image generate nahi ho saki 😢\n💘 Chance: ${chance}%`, event.threadID);
  }
};
