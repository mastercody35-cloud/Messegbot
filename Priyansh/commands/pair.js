module.exports.config = {
  name: "pair",
  version: "1.0.2",
  hasPermssion: 0,
  credits: "Fixed by Talha",
  description: "Pair you with someone randomly in the group with image",
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

  const { threadID, senderID, messageID } = event;

  // Temporary file paths
  const pathImg = __dirname + "/cache/pair_output.png";
  const pathAvt1 = __dirname + "/cache/pair_avt1.png";
  const pathAvt2 = __dirname + "/cache/pair_avt2.png";
  const pathBg = __dirname + "/cache/pair_bg.jpg";

  try {
    const threadInfo = await api.getThreadInfo(threadID);
    const members = threadInfo.participantIDs.filter(id => id !== senderID && !id.includes("1000")); // ignore self & potential bots

    if (members.length === 0) {
      return api.sendMessage("⚠️ No one is available to pair with you!", threadID, messageID);
    }

    const partnerID = members[Math.floor(Math.random() * members.length)];
    const name1 = await Users.getNameUser(senderID);
    const name2 = await Users.getNameUser(partnerID);

    // Get profile pictures
    const avatar1Buffer = (await axios.get(`https://graph.facebook.com/${senderID}/picture?width=512&height=512`, { responseType: "arraybuffer" })).data;
    const avatar2Buffer = (await axios.get(`https://graph.facebook.com/${partnerID}/picture?width=512&height=512`, { responseType: "arraybuffer" })).data;

    fs.writeFileSync(pathAvt1, Buffer.from(avatar1Buffer));
    fs.writeFileSync(pathAvt2, Buffer.from(avatar2Buffer));

    // Background image
    const bgURL = "https://i.imgur.com/UxLBebH.jpeg";
    const bgBuffer = (await axios.get(bgURL, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(pathBg, Buffer.from(bgBuffer));

    // Load all images
    const background = await loadImage(pathBg);
    const avatar1 = await loadImage(pathAvt1);
    const avatar2 = await loadImage(pathAvt2);

    // Create Canvas
    const canvas = createCanvas(600, 400);
    const ctx = canvas.getContext("2d");

    // Draw background
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    // Draw circular avatars
    ctx.save();
    ctx.beginPath();
    ctx.arc(125, 200, 75, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatar1, 50, 125, 150, 150);
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.arc(475, 200, 75, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatar2, 400, 125, 150, 150);
    ctx.restore();

    // Compatibility %
    const compatibility = Math.floor(Math.random() * 100) + 1;
    ctx.font = "bold 32px Arial";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.fillText(`💘 ${compatibility}% 💘`, canvas.width / 2, 220);

    // Save image
    const finalBuffer = canvas.toBuffer("image/png");
    fs.writeFileSync(pathImg, finalBuffer);

    // Send Message
    return api.sendMessage({
      body: `💞 ${name1} ❤️ ${name2}\n🥰 Compatibility: ${compatibility}%`,
      attachment: fs.createReadStream(pathImg),
      mentions: [
        { tag: name1, id: senderID },
        { tag: name2, id: partnerID }
      ]
    }, threadID, () => {
      // Cleanup
      fs.unlinkSync(pathImg);
      fs.unlinkSync(pathAvt1);
      fs.unlinkSync(pathAvt2);
      fs.unlinkSync(pathBg);
    }, messageID);

  } catch (err) {
    console.error("❌ Error in pair command:", err);
    return api.sendMessage("❌ Something went wrong while pairing. Please try again.", threadID, messageID);
  }
};
