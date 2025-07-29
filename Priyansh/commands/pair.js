module.exports.config = {
  name: "pair",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Fixed by Talha ✨",
  description: "Pair with someone based on gender",
  commandCategory: "fun",
  usages: "",
  cooldowns: 15,
  dependencies: {
    "axios": "",
    "fs-extra": "",
    "canvas": ""
  }
};

module.exports.run = async function ({ args, Users, Threads, api, event }) {
  const { loadImage, createCanvas } = require("canvas");
  const fs = global.nodemodule["fs-extra"];
  const axios = global.nodemodule["axios"];

  const pathImg = __dirname + "/cache/pair_bg.png";
  const pathAvt1 = __dirname + "/cache/pair_1.png";
  const pathAvt2 = __dirname + "/cache/pair_2.png";

  const id1 = event.senderID;
  const name1 = await Users.getNameUser(id1);

  const threadInfo = await api.getThreadInfo(event.threadID);
  const all = threadInfo.userInfo;
  let gender1 = null;

  for (let u of all) {
    if (u.id === id1) {
      gender1 = u.gender;
      break;
    }
  }

  const botID = api.getCurrentUserID();
  let candidates = [];

  for (let u of all) {
    if (u.id !== id1 && u.id !== botID && u.gender !== undefined) {
      if ((gender1 === "FEMALE" && u.gender === "MALE") || 
          (gender1 === "MALE" && u.gender === "FEMALE") || 
          (gender1 !== "MALE" && gender1 !== "FEMALE")) {
        candidates.push(u.id);
      }
    }
  }

  if (candidates.length === 0) {
    return api.sendMessage("⚠️ No suitable match found in the group.", event.threadID, event.messageID);
  }

  const id2 = candidates[Math.floor(Math.random() * candidates.length)];
  const name2 = await Users.getNameUser(id2);

  // Load avatars
  const getAvt1 = (
    await axios.get(`https://graph.facebook.com/${id1}/picture?width=720&height=720&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`, {
      responseType: "arraybuffer"
    })
  ).data;
  fs.writeFileSync(pathAvt1, Buffer.from(getAvt1, "utf-8"));

  const getAvt2 = (
    await axios.get(`https://graph.facebook.com/${id2}/picture?width=720&height=720&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`, {
      responseType: "arraybuffer"
    })
  ).data;
  fs.writeFileSync(pathAvt2, Buffer.from(getAvt2, "utf-8"));

  // Load background
  const backgroundUrl = "https://i.imgur.com/FN4Wb6w.jpeg";
  const getBg = (await axios.get(backgroundUrl, { responseType: "arraybuffer" })).data;
  fs.writeFileSync(pathImg, Buffer.from(getBg, "utf-8"));

  // Draw on canvas
  const baseImg = await loadImage(pathImg);
  const avatar1 = await loadImage(pathAvt1);
  const avatar2 = await loadImage(pathAvt2);
  const canvas = createCanvas(baseImg.width, baseImg.height);
  const ctx = canvas.getContext("2d");

  ctx.drawImage(baseImg, 0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.arc(790, 1000, 385, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(avatar1, 410, 600, 770, 795);
  ctx.restore();

  ctx.beginPath();
  ctx.arc(2465, 1000, 385, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(avatar2, 2080, 600, 770, 795);
  ctx.restore();

  const imageBuffer = canvas.toBuffer();
  fs.writeFileSync(pathImg, imageBuffer);

  // Clean temp
  fs.unlinkSync(pathAvt1);
  fs.unlinkSync(pathAvt2);

  // Match percentage logic
  const chanceList = ["0", "-1", "99.99", "-99", "-100", "101", "0.01"];
  const randomChance = Math.random() < 0.9 ? (Math.floor(Math.random() * 100) + 1) : chanceList[Math.floor(Math.random() * chanceList.length)];

  // Final send
  return api.sendMessage({
    body: `💞 𝗣𝗔𝗜𝗥 𝗠𝗔𝗧𝗖𝗛 𝗖𝗥𝗘𝗔𝗧𝗘𝗗 💞\n━━━━━━━━━━━━━━\n👦 ${name1} ❤️ ${name2}\n🔗 𝗟𝗢𝗩𝗘 𝗣𝗘𝗥𝗖𝗘𝗡𝗧: ${randomChance}% 💘`,
    mentions: [{ tag: name2, id: id2 }],
    attachment: fs.createReadStream(pathImg)
  }, event.threadID, () => fs.unlinkSync(pathImg), event.messageID);
};
