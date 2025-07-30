module.exports.config = {
  name: "pair2",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Talha ✨",
  description: "Cute love pair command",
  commandCategory: "Love",
  usages: "pair2",
  cooldowns: 5,
};

const axios = require("axios");
const fs = require("fs-extra");

module.exports.run = async function ({ api, event, Users }) {
  const threadID = event.threadID;

  // Get participant list
  const { participantIDs } = await api.getThreadInfo(threadID);
  const members = participantIDs.filter(id => id != api.getCurrentUserID());

  if (members.length < 2) {
    return api.sendMessage("⚠️ Kam az kam 2 members chahiye pairing ke liye!", threadID);
  }

  // Random 2 users
  const uid1 = members[Math.floor(Math.random() * members.length)];
  let uid2 = uid1;
  while (uid2 === uid1) {
    uid2 = members[Math.floor(Math.random() * members.length)];
  }

  // Get names
  const name1 = await Users.getNameUser(uid1);
  const name2 = await Users.getNameUser(uid2);

  // Get DPs
  const img1 = (await axios.get(`https://graph.facebook.com/${uid1}/picture?width=720&height=720`, { responseType: "stream" })).data;
  const img2 = (await axios.get(`https://graph.facebook.com/${uid2}/picture?width=720&height=720`, { responseType: "stream" })).data;

  const loveRatio = Math.floor(Math.random() * 40 + 60);

  const msg = {
    body: `
╔════ஓ๑♡๑ஓ════╗
  💘𝑪𝒖𝒕𝒆 𝑪𝒐𝒖𝒑𝒍𝒆'𝑺💘
╚════ஓ๑♡๑ஓ════╝

👩‍❤️‍👨 𝗝𝗼𝗱𝗶 𝗧𝗮𝗯𝗮𝗵 𝗞𝗮𝗿𝗻𝗲 𝗔𝗮𝗿𝗵𝗶 𝗛𝗮𝗶 🌸
❤️ ${name1}  💞  ${name2}
🔮 𝙻𝚘𝚟𝚎 𝙼𝚊𝚝𝚌𝚑: ${loveRatio}%

🎵 "𝑇𝑢𝑚 ℎ𝑜 𝑡𝑜 𝑠𝑎𝑎𝑟𝑎 𝑗ℎ𝑎𝑎𝑛 ℎ𝑎𝑖 𝑚𝑒𝑟𝑎..." 🎶

💘 𝑴𝒂𝒅𝒆 𝒃𝒚 𝑻𝒂𝒍𝒉𝒂 𝑷𝒂𝒕𝒉𝒂𝒏 💘
📌 𝗢𝗳𝗳𝗶𝗰𝗶𝗮𝗹 𝗕𝗼𝘁 𝗕𝘆 𝗧𝗮𝗹𝗵𝗮 ✨
`,
    mentions: [
      { tag: name1, id: uid1 },
      { tag: name2, id: uid2 }
    ],
    attachment: [img1, img2]
  };

  return api.sendMessage(msg, threadID);
};
