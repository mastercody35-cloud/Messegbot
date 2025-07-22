const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { loadImage, createCanvas, registerFont } = require("canvas");

module.exports.config = {
  name: "hack",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "Fixed by Talha ✨",
  description: "Hack style command with profile pic and background",
  commandCategory: "fun",
  usages: "@mention",
  cooldowns: 0,
  dependencies: {
    "axios": "",
    "fs-extra": "",
    "canvas": ""
  }
};

// Optional: Use custom font if you want
// registerFont(path.join(__dirname, 'fonts', 'Arial.ttf'), { family: "Arial" });

async function wrapText(ctx, text, maxWidth) {
  if (ctx.measureText(text).width < maxWidth) return [text];
  if (ctx.measureText('W').width > maxWidth) return null;

  const words = text.split(' ');
  const lines = [];
  let line = '';

  while (words.length > 0) {
    let split = false;
    while (ctx.measureText(words[0]).width >= maxWidth) {
      const temp = words[0];
      words[0] = temp.slice(0, -1);
      if (split) words[1] = `${temp.slice(-1)}${words[1]}`;
      else {
        split = true;
        words.splice(1, 0, temp.slice(-1));
      }
    }
    if (ctx.measureText(`${line}${words[0]}`).width < maxWidth) {
      line += `${words.shift()} `;
    } else {
      lines.push(line.trim());
      line = '';
    }
    if (words.length === 0) lines.push(line.trim());
  }
  return lines;
}

module.exports.run = async function ({ args, Users, api, event }) {
  try {
    const mentionID = Object.keys(event.mentions)[0] || event.senderID;
    const userName = await Users.getNameUser(mentionID);

    // File paths
    const pathImg = path.join(__dirname, "cache", "hack_bg.png");
    const pathAvt = path.join(__dirname, "cache", `avt_${mentionID}.png`);

    // Background image
    const bgURL = "https://i.imgur.com/VQXViKI.png";
    const bgImg = (await axios.get(bgURL, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(pathImg, Buffer.from(bgImg, "utf-8"));

    // User avatar
    const avatarUrl = `https://graph.facebook.com/${mentionID}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
    const avatarData = (await axios.get(avatarUrl, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(pathAvt, Buffer.from(avatarData, "utf-8"));

    // Load images
    const baseImage = await loadImage(pathImg);
    const userAvatar = await loadImage(pathAvt);

    // Create canvas
    const canvas = createCanvas(baseImage.width, baseImage.height);
    const ctx = canvas.getContext("2d");

    // Draw background
    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

    // Draw user name
    ctx.font = "23px Arial";
    ctx.fillStyle = "#1878F3";
    ctx.textAlign = "start";

    const lines = await wrapText(ctx, userName, 1160);
    ctx.fillText(lines.join('\n'), 200, 497);

    // Draw avatar
    ctx.beginPath();
    ctx.arc(133, 487, 50, 0, Math.PI * 2, true); // Optional: Make circle mask
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(userAvatar, 83, 437, 100, 100); // Draw inside clipped circle

    // Output
    const imageBuffer = canvas.toBuffer();
    fs.writeFileSync(pathImg, imageBuffer);
    fs.removeSync(pathAvt);

    return api.sendMessage({
      body: `🧠 Hacking ${userName}... 💻`,
      attachment: fs.createReadStream(pathImg)
    }, event.threadID, () => fs.unlinkSync(pathImg), event.messageID);

  } catch (e) {
    console.error("Hack command error:", e);
    return api.sendMessage("❌ Failed to execute hack command.", event.threadID);
  }
};
