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
  try {
    const fs = global.nodemodule["fs-extra"];
    const axios = global.nodemodule["axios"];
    const { loadImage, createCanvas } = require("canvas");

    const pathImg = __dirname + "/cache/pair_bg.png";
    const pathAvt1 = __dirname + "/cache/avt1.png";
    const pathAvt2 = __dirname + "/cache/avt2.png";

    const { senderID, threadID, messageID } = event;

    const threadInfo = await api.getThreadInfo(threadID);
    const members = threadInfo.participantIDs.filter(u => !threadInfo.nicknames[u]?.includes('BOT') && u !== senderID);

    if (members.length === 0) {
      return api.sendMessage("⚠️ No one available to pair with you.", threadID, messageID);
    }

    const target = members[Math.floor(Math.random() * members.length)];

    const name1 = await Users.getNameUser(senderID);
    const name2 = await Users.getNameUser(target);

    // Compatibility %
    const compatibility = Math.floor(Math.random() * 100) + 1;

    // Get avatars - using Facebook's public CDN
    const avt1 = (await axios.get(`https://graph.facebook.com/${senderID}/picture?width=512&height=512`, { 
      responseType: 'arraybuffer' 
    })).data;
    
    const avt2 = (await axios.get(`https://graph.facebook.com/${target}/picture?width=512&height=512`, { 
      responseType: 'arraybuffer' 
    })).data;

    fs.writeFileSync(pathAvt1, Buffer.from(avt1, "utf-8"));
    fs.writeFileSync(pathAvt2, Buffer.from(avt2, "utf-8"));

    // Background image
    const bgURL = "https://i.imgur.com/UxLBebH.jpeg";
    const bg = (await axios.get(bgURL, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(pathImg, Buffer.from(bg, "utf-8"));

    const canvas = createCanvas(600, 400);
    const ctx = canvas.getContext("2d");
    
    // Load images with error handling
    let baseImg, avatar1, avatar2;
    try {
      baseImg = await loadImage(pathImg);
      avatar1 = await loadImage(pathAvt1);
      avatar2 = await loadImage(pathAvt2);
    } catch (e) {
      console.error("Error loading images:", e);
      return api.sendMessage("❌ Error processing images. Please try again.", threadID, messageID);
    }

    ctx.drawImage(baseImg, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(avatar1, 50, 100, 150, 150);
    ctx.drawImage(avatar2, 400, 100, 150, 150);

    // Draw compatibility text
    ctx.font = "bold 30px Arial";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.fillText(`${compatibility}%`, canvas.width/2, 200);

    const buffer = canvas.toBuffer();
    fs.writeFileSync(pathImg, buffer);

    // Clean up temp files
    fs.unlinkSync(pathAvt1);
    fs.unlinkSync(pathAvt2);

    return api.sendMessage({
      body: `💘 ${name1} is now paired with ${name2}!\n❤️ Compatibility: ${compatibility}%`,
      mentions: [{ tag: name2, id: target }],
      attachment: fs.createReadStream(pathImg)
    }, threadID, () => fs.unlinkSync(pathImg), messageID);
    
  } catch (error) {
    console.error("Error in pair command:", error);
    return api.sendMessage("❌ An error occurred while processing the pair command. Please try again later.", threadID, messageID);
  }
};
