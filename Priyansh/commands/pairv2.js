module.exports.config = {
  name: "pairv2",
  version: "3.1.0",
  hasPermssion: 0,
  credits: "Talha❤️",
  description: "Pair two users with custom LOVE image output",
  commandCategory: "Love",
  usages: "*pairv2",
  cooldowns: 0
};

module.exports.run = async function ({ api, event, Users }) {
  const axios = require("axios");
  const fs = require("fs-extra");
  const Canvas = require("canvas");
  const path = require("path");
  const fetch = require("node-fetch");

  try {
    const threadInfo = await api.getThreadInfo(event.threadID);
    const senderID = event.senderID;
    const botID = api.getCurrentUserID();
    const participants = threadInfo.participantIDs.filter(id => id !== botID && id !== senderID);

    if (participants.length === 0) {
      return api.sendMessage("❌ Pair banane ke liye koi aur member nahi mila.", event.threadID);
    }

    const loverID = participants[Math.floor(Math.random() * participants.length)];
    const lovePercent = Math.floor(Math.random() * 101);

    const senderName = (await Users.getData(senderID)).name;
    const loverName = (await Users.getData(loverID)).name;

    const mentions = [
      { id: senderID, tag: senderName },
      { id: loverID, tag: loverName }
    ];

    // 🖼️ Load DPs
    const getAvatar = async (uid) => {
      const res = await axios.get(`https://graph.facebook.com/${uid}/picture?width=512&height=512&redirect=false`);
      const url = res.data.data.url;
      const response = await fetch(url);
      return await Canvas.loadImage(await response.buffer());
    };

    const avatar1 = await getAvatar(senderID);
    const avatar2 = await getAvatar(loverID);

    // 📸 Load background
    const bgPath = path.join(__dirname, "assets", "love_template.jpg");
    const bg = await Canvas.loadImage(bgPath);

    const canvas = Canvas.createCanvas(bg.width, bg.height);
    const ctx = canvas.getContext("2d");

    // 🖼️ Draw background
    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

    // 🔵 Circular crop helper
    const drawCircularImage = (img, x, y, size) => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(img, x, y, size, size);
      ctx.restore();
    };

    // 🎯 Position for avatars
    drawCircularImage(avatar1, 120, 120, 300); // left
    drawCircularImage(avatar2, canvas.width - 420, 120, 300); // right

    // 💬 Add text
    ctx.font = "40px Arial";
    ctx.fillStyle = "#ff2d75";
    ctx.fillText(`${senderName}`, 120, 450);
    ctx.fillText(`${loverName}`, canvas.width - 420, 450);

    ctx.font = "bold 50px Courier";
    ctx.fillStyle = "#e60073";
    ctx.fillText(`❤️ Match: ${lovePercent}% ❤️`, canvas.width / 2 - 220, 550);

    // 📤 Save and send image
    const outputPath = path.join(__dirname, "cache", `pair-${event.senderID}.png`);
    const out = fs.createWriteStream(outputPath);
    const stream = canvas.createPNGStream();
    stream.pipe(out);
    out.on("finish", () => {
      api.sendMessage({
        body: `💘 𝗟𝗢𝗩𝗘 𝗣𝗔𝗜𝗥𝗜𝗡𝗚 💘\n\n👤 ${senderName}\n❤️ ${lovePercent}% Love\n👤 ${loverName}`,
        mentions,
        attachment: fs.createReadStream(outputPath)
      }, event.threadID, () => fs.unlinkSync(outputPath));
    });

  } catch (err) {
    console.log("❌ Error in pairv2:", err);
    api.sendMessage("❌ Error aaya image banate waqt.", event.threadID);
  }
};
