module.exports.config = {
  name: "pair4",
  version: "1.0.2",
  hasPermssion: 0,
  credits: "Talha",
  description: "Perfect pairing with aligned avatars",
  commandCategory: "fun",
  cooldowns: 5,
  dependencies: {
    "axios": "",
    "fs-extra": "",
    "jimp": ""
  }
};

async function makeImage({ one, two }) {
  const fs = global.nodemodule["fs-extra"];
  const path = global.nodemodule["path"];
  const axios = global.nodemodule["axios"];
  const jimp = global.nodemodule["jimp"];
  const __root = path.resolve(__dirname, "cache", "paircanvas");

  // Create cache directory if not exists
  if (!fs.existsSync(__root)) fs.mkdirSync(__root, { recursive: true });

  // Base image (replace with your actual image URL)
  const baseImgUrl = "https://i.ibb.co/bgFhk6Bb/Messenger-creation-2611011159251969.jpg";
  const basePath = path.join(__root, "pair_base.png");
  
  try {
    // Download base image
    const baseImg = (await axios.get(baseImgUrl, { responseType: 'arraybuffer' })).data;
    fs.writeFileSync(basePath, Buffer.from(baseImg, 'binary'));
  } catch (e) {
    console.error("Base image error:", e);
    throw new Error("Couldn't download base image");
  }

  // Prepare avatar paths
  const avatar1Path = path.join(__root, `avt_${one}.png`);
  const avatar2Path = path.join(__root, `avt_${two}.png`);
  const outputPath = path.join(__root, `pair_result_${one}_${two}.png`);

  // Download avatars
  try {
    const avt1 = (await axios.get(
      `https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
      { responseType: 'arraybuffer' }
    )).data;
    fs.writeFileSync(avatar1Path, Buffer.from(avt1, 'binary'));
  } catch (e) {
    console.error("Avatar 1 error:", e);
    throw new Error("Couldn't download first avatar");
  }

  try {
    const avt2 = (await axios.get(
      `https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
      { responseType: 'arraybuffer' }
    )).data;
    fs.writeFileSync(avatar2Path, Buffer.from(avt2, 'binary'));
  } catch (e) {
    console.error("Avatar 2 error:", e);
    throw new Error("Couldn't download second avatar");
  }

  // Process images
  try {
    const base = await jimp.read(basePath);
    const avt1 = await jimp.read(avatar1Path);
    const avt2 = await jimp.read(avatar2Path);

    // Create circular masks
    avt1.circle().resize(380, 380); // Adjusted size
    avt2.circle().resize(380, 380);

    // Composite with precise positioning
    base.composite(avt1, 110, 190);  // Left position (adjust as needed)
    base.composite(avt2, 800, 190);  // Right position (adjust as needed)

    // Save final image
    await base.writeAsync(outputPath);
    
    // Cleanup
    fs.unlinkSync(avatar1Path);
    fs.unlinkSync(avatar2Path);
    fs.unlinkSync(basePath);

    return outputPath;
  } catch (e) {
    console.error("Image processing error:", e);
    throw new Error("Failed to process images");
  }
}

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID, senderID } = event;
  const fs = global.nodemodule["fs-extra"];
  
  try {
    // Get user info
    const userInfo = await api.getUserInfo(senderID);
    const senderName = userInfo[senderID].name;
    const senderGender = userInfo[senderID].gender;
    
    // Get thread info
    const threadInfo = await api.getThreadInfo(threadID);
    const participants = threadInfo.participantIDs.filter(id => id !== senderID);
    
    if (participants.length === 0) {
      return api.sendMessage("No one to pair with in this group!", threadID, messageID);
    }
    
    // Find opposite gender (if specified)
    const participantsInfo = await api.getUserInfo(participants);
    let potentialPairs = participants.filter(id => {
      if (senderGender === 1) return participantsInfo[id].gender === 2;
      if (senderGender === 2) return participantsInfo[id].gender === 1;
      return true;
    });
    
    if (potentialPairs.length === 0) potentialPairs = participants;
    
    // Select random pair
    const pairID = potentialPairs[Math.floor(Math.random() * potentialPairs.length)];
    const pairName = participantsInfo[pairID].name;
    
    // Generate random percentage
    const percentages = ['21%', '55%', '89%', '32%', '67%', '96%', '100%', '48%'];
    const randomPercent = percentages[Math.floor(Math.random() * percentages.length)];
    
    // Create image
    const imagePath = await makeImage({ one: senderID, two: pairID });
    
    // Send message
    return api.sendMessage({
      body: `🅢𝐔𝐂𝐂𝐄𝐒𝐒𝐅𝐔𝐋 🅟𝐀𝐈𝐑𝐈𝐍𝐆\n━━━━━━━━━━━━━━━━━━\n${senderName} 💓 ${pairName}\n━━━━━━━━━━━━━━━━━━\n💞 Compatibility: ${randomPercent}\n━━━━━━━━━━━━━━━━━━\n 𝐎𝐰𝐧𝐞𝐫 𝐓𝐀𝐥𝐡𝐚 ❤: `,
      mentions: [
        { tag: senderName, id: senderID },
        { tag: pairName, id: pairID }
      ],
      attachment: fs.createReadStream(imagePath)
    }, threadID, () => fs.unlinkSync(imagePath), messageID);
    
  } catch (error) {
    console.error("Pairing error:", error);
    return api.sendMessage("An error occurred while pairing. Please try again.", threadID, messageID);
  }
};
