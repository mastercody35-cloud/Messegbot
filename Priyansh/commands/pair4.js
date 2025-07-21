module.exports.config = {
  name: "pair",
  version: "3.1",
  hasPermssion: 0,
  credits: "Talha",
  description: "Perfect circle alignment for both positions",
  commandCategory: "fun",
  cooldowns: 5,
  dependencies: {
    "axios": "",
    "fs-extra": "",
    "jimp": ""
  }
};

async function createPerfectPair({ user1, user2 }) {
  const fs = global.nodemodule["fs-extra"];
  const path = global.nodemodule["path"];
  const axios = global.nodemodule["axios"];
  const jimp = global.nodemodule["jimp"];
  const __root = path.resolve(__dirname, "cache", "pair_circles");

  // Create directory
  if (!fs.existsSync(__root)) fs.mkdirSync(__root, { recursive: true });

  // File paths
  const bgPath = path.join(__root, "background.jpg");
  const leftPath = path.join(__root, "left.png");
  const rightPath = path.join(__root, "right.png");
  const outputPath = path.join(__root, "paired_result.jpg");

  // Download background
  await axios.get("https://i.ibb.co/bgFhk6Bb/Messenger-creation-2611011159251969.jpg", {
    responseType: 'arraybuffer'
  }).then(({ data }) => fs.writeFileSync(bgPath, Buffer.from(data, 'binary')));

  // Download avatars with error handling
  const downloadAvatar = async (uid, savePath) => {
    try {
      const { data } = await axios.get(
        `https://graph.facebook.com/${uid}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
        { responseType: 'arraybuffer' }
      );
      fs.writeFileSync(savePath, Buffer.from(data, 'binary'));
    } catch (e) {
      throw new Error(`Failed to download avatar for ${uid}`);
    }
  };

  await Promise.all([
    downloadAvatar(user1, leftPath),
    downloadAvatar(user2, rightPath)
  ]);

  // Process images
  try {
    const [background, leftAvatar, rightAvatar] = await Promise.all([
      jimp.read(bgPath),
      jimp.read(leftPath),
      jimp.read(rightPath)
    ]);

    // Perfect circle settings
    const circleDiameter = 360; // Optimal size for the rings
    leftAvatar.circle().resize(circleDiameter, circleDiameter);
    rightAvatar.circle().resize(circleDiameter, circleDiameter);

    // Exact tested positions
    background.composite(leftAvatar, 130, 125);  // Left circle (perfectly centered)
    background.composite(rightAvatar, 810, 125); // Right circle (perfectly centered)

    await background.quality(100).writeAsync(outputPath);
    
    // Cleanup
    [bgPath, leftPath, rightPath].forEach(f => fs.existsSync(f) && fs.unlinkSync(f));

    return outputPath;
  } catch (e) {
    console.error("Image processing error:", e);
    throw new Error("Failed to create paired image");
  }
}

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID, senderID } = event;
  const fs = global.nodemodule["fs-extra"];
  
  try {
    // Get user and thread info
    const [userInfo, threadInfo] = await Promise.all([
      api.getUserInfo(senderID),
      api.getThreadInfo(threadID)
    ]);
    
    const senderName = userInfo[senderID].name;
    const participants = threadInfo.participantIDs.filter(id => id !== senderID);
    
    if (participants.length === 0) {
      return api.sendMessage("No one to pair with! 😢", threadID, messageID);
    }
    
    // Select random participant
    const pairID = participants[Math.floor(Math.random() * participants.length)];
    const pairName = (await api.getUserInfo(pairID))[pairID].name;
    
    // Create perfectly aligned image
    const resultImg = await createPerfectPair({
      user1: senderID,
      user2: pairID
    });
    
    // Send result with romantic message
    return api.sendMessage({
      body: `💘 PERFECT LOVE MATCH 💘\n━━━━━━━━━━━━━━━━━━\n${senderName} ❤️ ${pairName}\n━━━━━━━━━━━━━━━━━━\n💞 Compatibility: ${['96%','89%','100%','76%'][Math.floor(Math.random()*4)]}\n━━━━━━━━━━━━━━━━━━\n"Tu has to zamana hasta hai..."\n"Tu udas to dil tota hai..."\n━━━━━━━━━━━━━━━━━━\nOwner: Talha`,
      mentions: [
        { tag: senderName, id: senderID },
        { tag: pairName, id: pairID }
      ],
      attachment: fs.createReadStream(resultImg)
    }, threadID, () => fs.unlinkSync(resultImg), messageID);
    
  } catch (error) {
    console.error("Pairing error:", error);
    return api.sendMessage("Pairing failed. Please try again later!", threadID, messageID);
  }
};
