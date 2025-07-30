module.exports.config = {
  name: "pair2",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Talha ✨",
  description: "Cute romantic pairing between two users",
  commandCategory: "Love",
  usages: "pair2",
  cooldowns: 5,
};

const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.run = async function ({ api, event, Users }) {
  const threadID = event.threadID;
  const messageID = event.messageID;

  const { participantIDs } = await api.getThreadInfo(threadID);
  const members = participantIDs.filter(id => id !== api.getCurrentUserID());

  if (members.length < 2) {
    return api.sendMessage("⚠️ Is group mein pairing k liye kam az kam 2 log honi chahiye!", threadID, messageID);
  }

  // Randomly select two members
  const uid1 = members[Math.floor(Math.random() * members.length)];
  let uid2 = uid1;
  while (uid2 === uid1) {
    uid2 = members[Math.floor(Math.random() * members.length)];
  }

  // Get user names
  const name1 = await Users.getNameUser(uid1);
  const name2 = await Users.getNameUser(uid2);

  // Fetch their DPs
  const dp1 = `https://graph.facebook.com/${uid1}/picture?width=720&height=720`;
  const dp2 = `https://graph.facebook.com/${uid2}/picture?width=720&height=720`;

  // Download DPs
  const pathImg1 = path.join(__dirname, `/cache/pair2_${uid1}.jpg`);
  const pathImg2 = path.join(__dirname, `/cache/pair2_${uid2}.jpg`);
  const bgPath = path.join(__dirname, "/cache/pair2bg.jpg");

  const bgURL = "https://i.imgur.com/zr3PfVm.jpg"; // Romantic background image
  const img1 = (await axios.get(dp1, { responseType: "arraybuffer" })).data;
  const img2 = (await axios.get(dp2, { responseType: "arraybuffer" })).data;
  const bg = (await axios.get(bgURL, { responseType: "arraybuffer" })).data;

  fs.writeFileSync(pathImg1, Buffer.from(img1));
  fs.writeFileSync(pathImg2, Buffer.from(img2));
  fs.writeFileSync(bgPath, Buffer.from(bg));

  // Send message
  const msg = {
    body: `
╔════ஓ๑♡๑ஓ════╗
     💕 𝑃𝑦𝑎𝑟𝑖 𝑃𝑎𝑖𝑟 𝐴𝑙𝑒𝑟𝑡 💕
╚════ஓ๑♡๑ஓ════╝

💘 ${name1} ❤️ ${name2}
🌹 𝑌𝑖 𝐽𝑜𝑑𝑖𝑖 𝐵𝑎𝑛𝑎𝑦𝑖 𝐺𝑎𝑦𝑖𝑖 ℎ𝑎𝑖𝑖 𝐴𝑎𝑠𝑚𝑎𝑎𝑛𝑜 𝑀𝑒𝑖𝑛!!
🔮 𝐿𝑜𝑣𝑒 𝑅𝑎𝑡𝑖𝑜: ${Math.floor(Math.random() * 40) + 60}% 💞
✨ 𝑶𝒘𝒏𝒆𝒓: 𝑻𝒂𝒍𝒉𝒂 ✨
`,
    mentions: [
      { tag: name1, id: uid1 },
      { tag: name2, id: uid2 }
    ],
    attachment: [
      fs.createReadStream(bgPath),
      fs.createReadStream(pathImg1),
      fs.createReadStream(pathImg2)
    ]
  };

  return api.sendMessage(msg, threadID, () => {
    fs.unlinkSync(pathImg1);
    fs.unlinkSync(pathImg2);
    fs.unlinkSync(bgPath);
  });
};
