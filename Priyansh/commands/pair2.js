module.exports.config = {
  name: "pair2",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Talha ✨",
  description: "Pair with a random girl from the group",
  commandCategory: "Love",
  usages: "pair2",
  cooldowns: 10
};

const axios = require("axios");
const fs = require("fs-extra");

module.exports.run = async function({ api, event, Users, Threads }) {
  const { threadID, senderID, messageID } = event;

  // Get all participants in the thread
  const threadInfo = await api.getThreadInfo(threadID);
  const allMembers = threadInfo.participantIDs;

  // Filter out girls (optional logic, here we assume girls have female gender if set)
  const usersData = await Promise.all(
    allMembers.map(async id => ({ 
      id, 
      gender: (await api.getUserInfo(id))[id]?.gender 
    }))
  );

  // Filter only female users
  const femaleUsers = usersData.filter(u => u.gender === 'female' && u.id !== senderID);
  if (femaleUsers.length === 0) {
    return api.sendMessage("❌ Group mein koi larki nahi mili pairing ke liye.", threadID, messageID);
  }

  const girl = femaleUsers[Math.floor(Math.random() * femaleUsers.length)];

  const senderName = (await api.getUserInfo(senderID))[senderID].name;
  const girlName = (await api.getUserInfo(girl.id))[girl.id].name;

  const lovePercent = Math.floor(Math.random() * 31) + 70;

  const senderDP = (await axios.get(`https://graph.facebook.com/${senderID}/picture?width=512&height=512&access_token=YOUR_TOKEN_HERE`, { responseType: 'arraybuffer' })).data;
  const girlDP = (await axios.get(`https://graph.facebook.com/${girl.id}/picture?width=512&height=512&access_token=YOUR_TOKEN_HERE`, { responseType: 'arraybuffer' })).data;

  fs.writeFileSync(__dirname + "/boy.png", Buffer.from(senderDP, "utf-8"));
  fs.writeFileSync(__dirname + "/girl.png", Buffer.from(girlDP, "utf-8"));

  const msg = {
    body: `
╔══ 💖 𝑷𝒂𝒊𝒓 𝑴𝒂𝒅𝒆 𝒊𝒏 𝑯𝒆𝒂𝒗𝒆𝒏 💖 ══╗

💘 𝓢𝔀𝓮𝓮𝓽 𝓛𝓸𝓿𝓮 𝓜𝓪𝓽𝓬𝓱 💘

👱‍♂️ 𝑯𝒆: ${senderName}
👩🏻‍🦰 𝑺𝒉𝒆: ${girlName}

❤️ 𝓛𝓸𝓿𝓮 𝓒𝓸𝓷𝓷𝓮𝓬𝓽𝓲𝓸𝓷: ${lovePercent}%

💌 𝓟𝓪𝓲𝓻 𝓒𝓻𝓮𝓪𝓽𝓮𝓭 𝓑𝔂: 𝑻𝒂𝒍𝒉𝒂 𝑷𝒂𝒕𝒉𝒂𝒏 ✨
╚════════════════════╝
`,
    attachment: [
      fs.createReadStream(__dirname + "/boy.png"),
      fs.createReadStream(__dirname + "/girl.png")
    ]
  };

  api.sendMessage(msg, threadID, () => {
    fs.unlinkSync(__dirname + "/boy.png");
    fs.unlinkSync(__dirname + "/girl.png");
  });
};
