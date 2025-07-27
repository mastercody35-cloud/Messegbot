module.exports.config = {
  name: "pair",
  version: "1.1.0",
  hasPermssion: 0,
  credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭",
  description: "Advanced pairing system with stylish presentation",
  commandCategory: "entertainment",
  cooldowns: 5,
  dependencies: {
    "axios": "",
    "fs-extra": "",
    "jimp": "",
    "canvas": ""
  }
};

async function makeStylishImage({ one, two, compatibility }) {
  const fs = global.nodemodule["fs-extra"];
  const path = global.nodemodule["path"];
  const axios = global.nodemodule["axios"];
  const jimp = global.nodemodule["jimp"];
  const { createCanvas, loadImage } = global.nodemodule["canvas"];
  const __root = path.resolve(__dirname, "cache", "pairing");

  if (!fs.existsSync(__root)) fs.mkdirSync(__root, { recursive: true });

  // Download template image
  const templateUrl = "https://i.imgur.com/8KQ3XfM.jpg"; // Stylish template
  const templatePath = path.join(__root, "template.jpg");
  
  try {
    const templateData = (await axios.get(templateUrl, { responseType: 'arraybuffer' })).data;
    fs.writeFileSync(templatePath, Buffer.from(templateData, 'binary'));
  } catch (error) {
    console.error("Error downloading template:", error);
    throw error;
  }

  // Download user avatars
  const avatarOnePath = path.join(__root, `avt_${one}.png`);
  const avatarTwoPath = path.join(__root, `avt_${two}.png`);
  
  try {
    const avatarOne = (await axios.get(
      `https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
      { responseType: 'arraybuffer' }
    )).data;
    fs.writeFileSync(avatarOnePath, Buffer.from(avatarOne, 'binary'));

    const avatarTwo = (await axios.get(
      `https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
      { responseType: 'arraybuffer' }
    )).data;
    fs.writeFileSync(avatarTwoPath, Buffer.from(avatarTwo, 'binary'));
  } catch (error) {
    console.error("Error downloading avatars:", error);
    throw error;
  }

  // Create canvas
  const canvas = createCanvas(1200, 630);
  const ctx = canvas.getContext('2d');

  // Load and draw template
  const template = await loadImage(templatePath);
  ctx.drawImage(template, 0, 0, canvas.width, canvas.height);

  // Draw circular avatars
  const drawCircularAvatar = async (imgPath, x, y, radius) => {
    const avatar = await loadImage(imgPath);
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatar, x - radius, y - radius, radius * 2, radius * 2);
    ctx.restore();
  };

  await drawCircularAvatar(avatarOnePath, 300, 315, 120);
  await drawCircularAvatar(avatarTwoPath, 900, 315, 120);

  // Add text
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 40px Arial";
  ctx.textAlign = "center";
  
  // Add compatibility meter
  ctx.fillStyle = "#ff6b9e";
  ctx.fillRect(400, 400, 400 * (parseInt(compatibility)/100, 30);
  
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 28px Arial";
  ctx.fillText(`${compatibility}% Compatibility`, 600, 380);
  
  ctx.font = "bold 36px Arial";
  ctx.fillText("❤️ Perfect Match ❤️", 600, 470);

  // Save final image
  const resultPath = path.join(__root, `pair_${one}_${two}.png`);
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(resultPath, buffer);

  // Cleanup
  [templatePath, avatarOnePath, avatarTwoPath].forEach(file => {
    if (fs.existsSync(file)) fs.unlinkSync(file);
  });

  return resultPath;
}

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID, senderID } = event;
  const fs = require("fs-extra");
  
  // Improved compatibility calculation
  const getCompatibility = () => {
    const percentages = ['85%', '92%', '78%', '95%', '88%', '82%', '90%', '96%', '79%', '93%'];
    return percentages[Math.floor(Math.random() * percentages.length)];
  };
  const compatibility = getCompatibility();

  try {
    const userInfo = await api.getUserInfo(senderID);
    const name1 = userInfo[senderID].name;
    const senderGender = userInfo[senderID].gender;

    const threadInfo = await api.getThreadInfo(threadID);
    let participantIDs = threadInfo.participantIDs.filter(id => id !== senderID);

    if (participantIDs.length === 0) {
      return api.sendMessage(
        "🌸 No one else is in the group to pair with!",
        threadID,
        messageID
      );
    }

    const participantsInfo = await api.getUserInfo(participantIDs);
    let potentialMatches = [];

    if (senderGender === 2) { // Male
      potentialMatches = participantIDs.filter(id => participantsInfo[id]?.gender === 1);
    } else if (senderGender === 1) { // Female
      potentialMatches = participantIDs.filter(id => participantsInfo[id]?.gender === 2);
    } else {
      potentialMatches = participantIDs;
    }

    const randomID = potentialMatches.length > 0 
      ? potentialMatches[Math.floor(Math.random() * potentialMatches.length)]
      : participantIDs[Math.floor(Math.random() * participantIDs.length)];

    const name2 = participantsInfo[randomID].name;

    const mentions = [
      { id: senderID, tag: name1 },
      { id: randomID, tag: name2 }
    ];

    const imagePath = await makeStylishImage({
      one: senderID,
      two: randomID,
      compatibility
    });

    const stylishMessage = `
✨ *𝐏𝐀𝐈𝐑 𝐑𝐄𝐒𝐔𝐋𝐓𝐒* ✨

💑 𝗣𝗮𝗶𝗿𝗲𝗱 𝗪𝗶𝘁𝗵:
━━━━━━━━━━━━━━━━━━
👤 ${name1}
❤️ 𝗔𝗡𝗗 ❤️
👤 ${name2}
━━━━━━━━━━━━━━━━━━

💞 𝗖𝗼𝗺𝗽𝗮𝘁𝗶𝗯𝗶𝗹𝗶𝘁𝘆 𝗦𝗰𝗼𝗿𝗲: ${compatibility}
${compatibility >= '90%' ? "🔥 𝗣𝗘𝗥𝗙𝗘𝗖𝗧 𝗠𝗔𝗧𝗖𝗛! 🔥" : "🌟 𝗚𝗼𝗼𝗱 𝗠𝗮𝘁𝗰𝗵! 🌟"}

💌 𝗠𝗲𝘀𝘀𝗮𝗴𝗲: "May your connection blossom into something beautiful!"

© 𝗖𝗿𝗲𝗱𝗶𝘁𝘀: 𝐓𝐚𝐥𝐡𝐚 𝐏𝐚𝐭𝐡𝐚𝐧
    `;

    return api.sendMessage({
      body: stylishMessage,
      mentions,
      attachment: fs.createReadStream(imagePath)
    }, threadID, () => fs.unlinkSync(imagePath), messageID);
    
  } catch (error) {
    console.error("Pairing error:", error);
    return api.sendMessage(
      "❌ An error occurred while finding your match. Please try again later.",
      threadID,
      messageID
    );
  }
};
