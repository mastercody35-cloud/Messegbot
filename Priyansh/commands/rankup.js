const fs = require("fs-extra");
const axios = require("axios");
const { loadImage, createCanvas } = require("canvas");

module.exports.config = {
  name: "rankup",
  version: "7.3.1",
  hasPermssion: 1,
  credits: "Mirai | Fixed by Talha",
  description: "Stylish rank up system with auto image",
  commandCategory: "Edit-IMG",
  cooldowns: 2
};

module.exports.handleEvent = async function ({ api, event, Currencies, Users }) {
  const { threadID, senderID } = event;
  const expData = await Currencies.getData(senderID);
  if (!expData || typeof expData.exp !== "number") return;
  
  let exp = expData.exp + 1;
  await Currencies.setData(senderID, { exp });

  const curLevel = Math.floor((Math.sqrt(1 + (4 * exp / 3) + 1) / 2));
  const level = Math.floor((Math.sqrt(1 + (4 * (exp + 1) / 3) + 1) / 2));

  if (level <= curLevel || level === 1) return;

  const name = await Users.getNameUser(senderID);
  const backgroundLinks = [
    "https://i.imgur.com/tVCXB0q.jpeg",
    "https://i.imgur.com/JBYox72.jpeg",
    "https://i.imgur.com/SRRuSRk.jpeg",
    "https://i.imgur.com/qhx5HLz.jpeg"
  ];
  const bgUrl = backgroundLinks[Math.floor(Math.random() * backgroundLinks.length)];

  // Fetch profile pic
  const avatar = await axios.get(`https://graph.facebook.com/${senderID}/picture?width=512&height=512&access_token=350685531728|62f8ce9f74b12f84c123cc23437a4a32`, { responseType: 'arraybuffer' });
  fs.writeFileSync(__dirname + `/cache/avt_${senderID}.png`, Buffer.from(avatar.data, "utf-8"));

  // Create Canvas
  const canvas = createCanvas(800, 400);
  const ctx = canvas.getContext("2d");

  const background = await loadImage(bgUrl);
  const avatarImg = await loadImage(__dirname + `/cache/avt_${senderID}.png`);
  ctx.drawImage(background, 0, 0, 800, 400);

  // Avatar Circle
  ctx.save();
  ctx.beginPath();
  ctx.arc(400, 200, 90, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(avatarImg, 310, 110, 180, 180);
  ctx.restore();

  // Text Style
  ctx.font = "bold 30px Arial";
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.fillText(`🌟 Rank Up 🌟`, 400, 50);
  ctx.fillText(`Congratulations, ${name}!`, 400, 320);
  ctx.fillText(`🔥 You reached level ${level} 🔥`, 400, 360);

  const path = __dirname + `/cache/rankup_${senderID}.png`;
  const out = fs.createWriteStream(path);
  const stream = canvas.createPNGStream();
  stream.pipe(out);
  out.on("finish", () => {
    api.sendMessage({
      body: `╔═══════ ೋღ 🌺 ღೋ ═══════╗\n🎉 *Rank Up Alert* 🎉\n\n✨ نام: ${name}\n📈 نیا لیول: ${level}\n\n🏆 محنت جاری رکھو، کامیابی تمھارے قدم چومے گی!\n╚═══════ ೋღ 🌺 ღೋ ═══════╝`,
      attachment: fs.createReadStream(path)
    }, threadID, () => fs.unlinkSync(path));
  });

  fs.unlinkSync(__dirname + `/cache/avt_${senderID}.png`);
};
