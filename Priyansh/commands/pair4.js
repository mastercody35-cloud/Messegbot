module.exports.config = {
  name: "pair",
  version: "4.0",
  hasPermssion: 0,
  credits: "Talha",
  description: "Perfectly aligned pairing with circles",
  commandCategory: "pair",
  cooldowns: 5,
  dependencies: {
    "axios": "",
    "fs-extra": "",
    "jimp": ""
  }
};

async function createPerfectPair({ user1, user2 }) {
  const fs = require('fs-extra');
  const path = require('path');
  const axios = require('axios');
  const jimp = require('jimp');
  const __root = path.resolve(__dirname, "cache", "pair_images");

  // Create directory if not exists
  if (!fs.existsSync(__root)) fs.mkdirSync(__root, { recursive: true });

  // File paths
  const bgPath = path.join(__root, "background.jpg");
  const leftPath = path.join(__root, "left.png");
  const rightPath = path.join(__root, "right.png");
  const outputPath = path.join(__root, "result.jpg");

  try {
    // Download background image
    const bgResponse = await axios.get("https://i.ibb.co/bgFhk6Bb/Messenger-creation-2611011159251969.jpg", {
      responseType: 'arraybuffer'
    });
    fs.writeFileSync(bgPath, Buffer.from(bgResponse.data, 'binary'));

    // Download profile pictures
    const downloadAvatar = async (uid, savePath) => {
      const response = await axios.get(
        `https://graph.facebook.com/${uid}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
        { responseType: 'arraybuffer' }
      );
      fs.writeFileSync(savePath, Buffer.from(response.data, 'binary'));
    };

    await Promise.all([
      downloadAvatar(user1, leftPath),
      downloadAvatar(user2, rightPath)
    ]);

    // Process images
    const [background, leftAvatar, rightAvatar] = await Promise.all([
      jimp.read(bgPath),
      jimp.read(leftPath),
      jimp.read(rightPath)
    ]);

    // Circle settings
    const circleSize = 360;
    leftAvatar.circle().resize(circleSize, circleSize);
    rightAvatar.circle().resize(circleSize, circleSize);

    // Perfect positions (tested coordinates)
    background.composite(leftAvatar, 130, 125);  // Left circle
    background.composite(rightAvatar, 810, 125); // Right circle

    await background.quality(100).writeAsync(outputPath);

    // Cleanup
    [bgPath, leftPath, rightPath].forEach(f => {
      if (fs.existsSync(f)) fs.unlinkSync(f);
    });

    return outputPath;
  } catch (error) {
    console.error("Error in createPerfectPair:", error);
    throw error;
  }
}

module.exports.run = async function ({ api, event }) {
  try {
    const fs = require('fs-extra');
    const { threadID, messageID, senderID } = event;

    // Get user info
    const userInfo = await api.getUserInfo(senderID);
    const senderName = userInfo[senderID].name;

    // Get thread info
    const threadInfo = await api.getThreadInfo(threadID);
    const participants = threadInfo.participantIDs.filter(id => id !== senderID);

    if (participants.length === 0) {
      return api.sendMessage("No users to pair with!", threadID, messageID);
    }

    // Select random participant
    const pairID = participants[Math.floor(Math.random() * participants.length)];
    const pairInfo = await api.getUserInfo(pairID);
    const pairName = pairInfo[pairID].name;

    // Create image
    const resultImg = await createPerfectPair({
      user1: senderID,
      user2: pairID
    });

    // Send result
    return api.sendMessage({
      body: `💘 PERFECT MATCH 💘\n━━━━━━━━━━━━━━━━━━\n${senderName} ❤️ ${pairName}\n━━━━━━━━━━━━━━━━━━\n💞 Compatibility: ${['96%','89%','100%','76%'][Math.floor(Math.random()*4)]}\n━━━━━━━━━━━━━━━━━━\nOwner: Talha`,
      mentions: [
        { tag: senderName, id: senderID },
        { tag: pairName, id: pairID }
      ],
      attachment: fs.createReadStream(resultImg)
    }, threadID, () => fs.unlinkSync(resultImg), messageID);

  } catch (error) {
    console.error("Error in pair command:", error);
    return api.sendMessage("Failed to create pair. Please try again later!", threadID, messageID);
  }
};
