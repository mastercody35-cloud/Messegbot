module.exports.config = {
  name: "pairv2",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "Fix by Talha❤️",
  description: "Stylish Love Pairing with ID and GIF",
  commandCategory: "Love",
  usages: "*pairv2",
  cooldowns: 0
};

module.exports.run = async function({ api, event, Users }) {
  const axios = global.nodemodule["axios"];
  const fs = global.nodemodule["fs-extra"];

  try {
    const threadInfo = await api.getThreadInfo(event.threadID);
    if (!threadInfo || !threadInfo.participantIDs) {
      return api.sendMessage("❌ Participants ki list nahi mil saki. Bot ko group admin banao.", event.threadID);
    }

    const senderID = event.senderID;
    const botID = api.getCurrentUserID();
    const participantIDs = threadInfo.participantIDs.filter(id => id !== botID && id !== senderID);

    if (participantIDs.length === 0) {
      return api.sendMessage("❌ Pair banane ke liye koi aur member nahi mila.", event.threadID);
    }

    const loverID = participantIDs[Math.floor(Math.random() * participantIDs.length)];
    const lovePercent = Math.floor(Math.random() * 101);

    const senderData = await Users.getData(senderID);
    const loverData = await Users.getData(loverID);
    const senderName = senderData.name;
    const loverName = loverData.name;

    const mentions = [
      { id: senderID, tag: senderName },
      { id: loverID, tag: loverName }
    ];

    // ✅ SAFE GIF (No Pinterest!)
    const gifUrl = "https://media1.giphy.com/media/3o6gE5aYp3WdeFdvDi/giphy.gif";
    const gifPath = __dirname + "/cache/love.gif";

    const gifData = await axios.get(gifUrl, { responseType: "arraybuffer" });
    fs.writeFileSync(gifPath, Buffer.from(gifData.data, "utf-8"));

    // 💬 Stylish pairing message
    const msg = {
      body:
`🎉 𝗦𝗨𝗖𝗖𝗘𝗦𝗦𝗙𝗨𝗟 𝗣𝗔𝗜𝗥𝗜𝗡𝗚 💘
━━━━━━━━━━━━━━━━━━━━
👤 𝗣𝗘𝗥𝗦𝗢𝗡 𝟭:
🔹 Name: ${senderName}
🔹 ID: ${senderID}

👤 𝗣𝗘𝗥𝗦𝗢𝗡 𝟮:
🔹 Name: ${loverName}
🔹 ID: ${loverID}

❤️ Compatibility: ${lovePercent}%
━━━━━━━━━━━━━━━━━━━━
💬 HOPE YOU BOTH WILL STOP FLIRTING 😏
👑 OWNER: TALHA ❤️`,
      mentions,
      attachment: fs.createReadStream(gifPath)
    };

    return api.sendMessage(msg, event.threadID, () => {
      fs.unlinkSync(gifPath);
    });

  } catch (err) {
    console.log("❌ pairv2 Error:", err);
    return api.sendMessage("❌ Error aaya pairing mein. Try again later!", event.threadID);
  }
};
