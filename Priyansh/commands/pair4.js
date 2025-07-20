module.exports.config = {
  name: "pair4",
  version: "1.0.2",
  hasPermssion: 0,
  credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭 | Modified by Talha",
  description: "Create romantic pairs with profile pictures",
  commandCategory: "Fun",
  cooldowns: 5,
  dependencies: {
    "axios": "",
    "fs-extra": "",
    "jimp": "",
    "canvas": ""
  }
};

async function makeImage({ one, two }) {
  const fs = global.nodemodule["fs-extra"];
  const path = global.nodemodule["path"];
  const axios = global.nodemodule["axios"];
  const jimp = global.nodemodule["jimp"];
  const __root = path.resolve(__dirname, "cache", "canvas");

  // Create canvas folder if it doesn't exist
  if (!fs.existsSync(__root)) fs.mkdirSync(__root, { recursive: true });

  // Download base image (replace with your preferred background)
  const pairingImgUrl = "https://i.imgur.com/8Zk0wBq.jpg"; // Romantic background
  const baseImagePath = path.join(__root, "pairing_temp.png");
  const baseImageBuffer = (await axios.get(pairingImgUrl, { responseType: 'arraybuffer' })).data;
  fs.writeFileSync(baseImagePath, Buffer.from(baseImageBuffer, 'utf-8'));

  let pairing_img = await jimp.read(baseImagePath);
  let pathImg = path.join(__root, `pairing_${one}_${two}.png`);
  let avatarOne = path.join(__root, `avt_${one}.png`);
  let avatarTwo = path.join(__root, `avt_${two}.png`);

  // Get profile pictures with better error handling
  try {
    let getAvatarOne = (await axios.get(`https://graph.facebook.com/${one}/picture?width=512&height=512`, { responseType: 'arraybuffer' })).data;
    fs.writeFileSync(avatarOne, Buffer.from(getAvatarOne, 'utf-8'));

    let getAvatarTwo = (await axios.get(`https://graph.facebook.com/${two}/picture?width=512&height=512`, { responseType: 'arraybuffer' })).data;
    fs.writeFileSync(avatarTwo, Buffer.from(getAvatarTwo, 'utf-8'));
  } catch (error) {
    console.error("Error fetching profile pictures:", error);
    throw error;
  }

  // Process images with better positioning
  let circleOne = await jimp.read(await circle(avatarOne));
  let circleTwo = await jimp.read(await circle(avatarTwo));

  // Adjust these coordinates to position the profile pictures perfectly
  pairing_img
    .composite(circleOne.resize(200, 200), 150, 150)  // Left side
    .composite(circleTwo.resize(200, 200), 450, 150); // Right side

  // Add romantic overlay
  const overlay = await jimp.read("https://i.imgur.com/XrYVh4P.png"); // Heart overlay
  pairing_img.composite(overlay.resize(800, 500), 0, 0);

  let raw = await pairing_img.getBufferAsync("image/png");
  fs.writeFileSync(pathImg, raw);

  // Clean up
  [avatarOne, avatarTwo, baseImagePath].forEach(file => {
    if (fs.existsSync(file)) fs.unlinkSync(file);
  });

  return pathImg;
}

async function circle(image) {
  const jimp = require("jimp");
  image = await jimp.read(image);
  image.circle();
  return await image.getBufferAsync("image/png");
}

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID, senderID } = event;
  const fs = require("fs-extra");
  
  // Romantic compatibility percentages
  const tl = ['21%', '35%', '55%', '89%', '22%', '45%', '99%', '78%', '15%', '91%', '77%', '100%'];
  const tle = tl[Math.floor(Math.random() * tl.length)];
  
  // Romantic quotes
  const quotes = [
    "❤️ In your arms is where I belong, with you is where I feel strong ❤️",
    "🌹 Two hearts, one love, forever entwined above 🌹",
    "💞 Like stars in the night, our love shines bright 💞",
    "✨ You and me, like a perfect harmony ✨",
    "🌸 Our love story is my favorite, written in the stars above 🌸"
  ];
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  try {
    const userInfo = await api.getUserInfo(senderID);
    const namee = userInfo[senderID].name;

    const threadInfo = await api.getThreadInfo(threadID);
    const participants = threadInfo.participantIDs.filter(id => id != senderID);
    const randomID = participants[Math.floor(Math.random() * participants.length)];

    const partnerInfo = await api.getUserInfo(randomID);
    const name = partnerInfo[randomID].name;
    const gender = partnerInfo[randomID].gender == 2 ? "Male 🧑" : "Female 👩";

    const arraytag = [
      { id: senderID, tag: namee },
      { id: randomID, tag: name }
    ];

    const one = senderID, two = randomID;

    return makeImage({ one, two }).then(path => {
      api.sendMessage({
        body: `💖 𝐑𝐨𝐦𝐚𝐧𝐭𝐢𝐜 𝐏𝐚𝐢𝐫𝐢𝐧𝐠 💖\n\n✨ ${namee} + ${name} = ${tle} Compatibility ✨\n\n${randomQuote}\n\n💌 "Some souls are meant to be together, like yours and mine forever" 💌\n\n🌸 𝐎𝐰𝐧𝐞𝐫: 𝐓𝐚𝐥𝐡𝐚 🌸`,
        mentions: arraytag,
        attachment: fs.createReadStream(path)
      }, threadID, () => fs.unlinkSync(path), messageID);
    });
  } catch (error) {
    console.error("Error in pair command:", error);
    api.sendMessage("❌ An error occurred while creating your romantic pair. Please try again later.", threadID, messageID);
  }
};
