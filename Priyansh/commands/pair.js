module.exports.config = {
  name: "pair",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "Fixed by Talha",
  description: "Pair you with someone randomly in group",
  commandCategory: "Fun",
  usages: "",
  cooldowns: 5,
  dependencies: {
    "axios": "",
    "fs-extra": "",
    "canvas": ""
  }
};

module.exports.run = async function ({ Users, api, event }) {
  const fs = global.nodemodule["fs-extra"];
  const axios = global.nodemodule["axios"];
  const { loadImage, createCanvas } = require("canvas");

  const pathImg = __dirname + "/cache/pair_bg.png";
  const pathAvt1 = __dirname + "/cache/avt1.png";
  const pathAvt2 = __dirname + "/cache/avt2.png";

  const { senderID, threadID, messageID } = event;

  const threadInfo = await api.getThreadInfo(threadID);
  const members = threadInfo.userInfo.filter(u => !u.isBot && u.id !== senderID);

  if (members.length === 0)
    return api.sendMessage("⚠️ No one available to pair with you.", threadID, messageID);

  const target = members[Math.floor(Math.random() * members.length)];

  const name1 = await Users.getNameUser(senderID);
  const name2 = await Users.getNameUser(target.id);

  // Compatibility %
  const compatibility = Math.floor(Math.random() * 100) + 1;

  // Get avatars
  const avt1 = (await axios.get(`https://graph.facebook.com/${senderID}/picture?width=512&height=512&access_token=`, { responseType: 'arraybuffer' })).data;
  const avt2 = (await axios.get(`https://graph.facebook.com/${target.id}/picture?width=512&height=512&access_token=`, { responseType: 'arraybuffer' })).data;

  fs.writeFileSync(pathAvt1, Buffer.from(avt1, "utf-8"));
  fs.writeFileSync(pathAvt2, Buffer.from(avt2, "utf-8"));

  // Background image
  const bgURL = "https://i.imgur.com/UxLBebH.jpeg";
  const bg = (await axios.get(bgURL, { responseType: "arraybuffer" })).data;
  fs.writeFileSync(pathImg, Buffer.from(bg, "utf-8"));

  const canvas = createCanvas(600, 400);
  const ctx = canvas.getContext("2d");
  const baseImg = await loadImage(pathImg);
  const avatar1 = await loadImage(pathAvt1);
  const avatar2 = await loadImage(pathAvt2);

  ctx.drawImage(baseImg, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(avatar1, 50, 100, 150, 150);
  ctx.drawImage(avatar2, 400, 100, 150, 150);

  ctx.font = "bold 30px Arial";
  ctx.fillStyle = "#ffffff";
  ctx.fillText(`${compatibility}%`, 260, 200);

  const buffer = canvas.toBuffer();
  fs.writeFileSync(pathImg, buffer);

  fs.unlinkSync(pathAvt1);
  fs.unlinkSync(pathAvt2);

  return api.sendMessage({
    body: `💘 ${name1} is now paired with ${name2}!\n❤️ Compatibility: ${compatibility}%`,
    mentions: [{ tag: name2, id: target.id }],
    attachment: fs.createReadStream(pathImg)
  }, threadID, () => fs.unlinkSync(pathImg), messageID);
};
