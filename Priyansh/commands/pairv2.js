const fs = require("fs-extra");
const axios = require("axios");
const Canvas = require("canvas");
const path = require("path");

module.exports.config = {
  name: "pairv2",
  version: "3.0.3",
  hasPermssion: 0,
  credits: "✨ Fix by Talha ❤️",
  description: "💘 Stylish Pair with Center Love & Circular DPs",
  commandCategory: "💑 Love",
  usages: "*pairv2",
  cooldowns: 0
};

module.exports.run = async function ({ api, event, Users }) {
  try {
    const threadInfo = await api.getThreadInfo(event.threadID);
    const senderID = event.senderID;
    const botID = api.getCurrentUserID();

    const participants = threadInfo.participantIDs.filter(id => id !== botID && id !== senderID);
    if (participants.length === 0)
      return api.sendMessage("❌ Pair banane ke liye koi aur member nahi mila.", event.threadID);

    const loverID = participants[Math.floor(Math.random() * participants.length)];
    const lovePercent = Math.floor(Math.random() * 101);

    const senderData = await Users.getData(senderID);
    const loverData = await Users.getData(loverID);

    const senderName = senderData.name;
    const loverName = loverData.name;

    const mentions = [
      { id: senderID, tag: senderName },
      { id: loverID, tag: loverName }
    ];

    const senderAvatarURL = `https://graph.facebook.com/${senderID}/picture?width=512&height=512`;
    const loverAvatarURL = `https://graph.facebook.com/${loverID}/picture?width=512&height=512`;

    const bgURL = "https://i.ibb.co/vJd0QmX/lovebg.jpg";
    const couplePNG = "https://i.ibb.co/Yt09k0B/couple-center.png";

    const pathImg = path.join(__dirname, `cache/pair_${Date.now()}.png`);
    const bg = await Canvas.loadImage((await axios.get(bgURL, { responseType: "arraybuffer" })).data);
    const coupleMid = await Canvas.loadImage((await axios.get(couplePNG, { responseType: "arraybuffer" })).data);

    const senderAvatar = await Canvas.loadImage((await axios.get(senderAvatarURL, { responseType: "arraybuffer" })).data);
    const loverAvatar = await Canvas.loadImage((await axios.get(loverAvatarURL, { responseType: "arraybuffer" })).data);

    const canvas = Canvas.createCanvas(1000, 500);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(bg, 0, 0, 1000, 500);

    // Draw circular DPs
    const drawCircle = (img, x, y, size) => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(img, x, y, size, size);
      ctx.restore();
    };

    drawCircle(senderAvatar, 80, 130, 250);      // Left DP
    drawCircle(loverAvatar, 670, 130, 250);      // Right DP
    ctx.drawImage(coupleMid, 390, 160, 220, 180); // Center couple PNG

    const buffer = canvas.toBuffer("image/png");
    fs.writeFileSync(pathImg, buffer);

    const msg = {
      body:
`🌸💕 𝗢𝘄𝗻𝗲𝗿 ➻ 𝙊𝙬𝙣𝙚𝙧 ➻ ❤️‍🔥 𝙏𝙖𝙡𝙝𝙖 𝙋𝙖𝙩𝙝𝙖𝙣 ❤️‍🔥

[•|• 𝑨𝒏𝒌𝒉𝒐 𝒎𝒆 𝒃𝒂𝒔𝒂𝒍𝒖 𝒕𝒖𝒋𝒉𝒌𝒐. 💙💞 
     𝑺𝒉𝒆𝒆𝒔𝒉𝒆 𝒎𝒆 𝒕𝒆𝒓𝒂𝒅𝒆𝒆𝒅𝒂𝒂𝒓 𝒉𝒐..💗🥰🐬 •|•]

✦──────── 💝 ────────✦

[•|• 𝑨𝒌 𝒘𝒂𝒒𝒕 𝒆𝒔𝒂 𝒂𝒂𝒚𝒆 𝒋𝒊𝒏𝒅𝒈𝒊 𝒎𝒆 𝒌𝒊𝒊... 💚💜 
     𝒕𝒖𝒋𝒉𝒌𝒐 𝒗 𝒉𝒖𝒎𝒔𝒆 𝒑𝒚𝒂𝒂𝒓 𝒉𝒐 .. 💜❤️✨ •|•]

✦──────── 💝 ────────✦

👤 Name 1: ${senderName}
🆔 ID: ${senderID}

👤 Name 2: ${loverName}
🆔 ID: ${loverID}

🌸 The odds are: 【${lovePercent}%】

💘 𝙃𝙊𝙋𝙀 𝙔𝙊𝙐 𝘽𝙊𝙏𝙃 𝙒𝙄𝙇𝙇 𝙎𝙏𝙊𝙋 𝙁𝙇𝙄𝙍𝙏𝙄𝙉𝙂 😏
👑 𝙊𝙒𝙉𝙀𝙍: ✨ 𝗧𝗔𝗟𝗛𝗔 ✨`,
      mentions,
      attachment: fs.createReadStream(pathImg)
    };

    api.sendMessage(msg, event.threadID, () => {
      fs.unlinkSync(pathImg);
    });

  } catch (err) {
    console.log("❌ pairv2 Error:", err);
    return api.sendMessage("❌ Error aaya pairing mein. Try again later!", event.threadID);
  }
};
