module.exports.config = {
  name: "pair",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "✨ Talha Pathan 💖",
  description: "Stylish love pairing command with fancy style",
  commandCategory: "💑 Love",
  usages: "*pair2",
  cooldowns: 10
};

module.exports.run = async function({ api, event, Threads, Users }) {
  const axios = global.nodemodule["axios"];
  const fs = global.nodemodule["fs-extra"];

  const { participantIDs } = (await Threads.getData(event.threadID)).threadInfo;
  const botID = api.getCurrentUserID();
  const senderID = event.senderID;
  const senderName = (await Users.getData(senderID)).name;
  const otherUserIDs = participantIDs.filter(id => id !== botID && id !== senderID);
  const loverID = otherUserIDs[Math.floor(Math.random() * otherUserIDs.length)];
  const loverName = (await Users.getData(loverID)).name;

  const compatibility = Math.floor(Math.random() * 101);
  const gifLinks = [
    "https://i.pinimg.com/originals/42/9a/89/429a890a39e70d522d52c7e52bce8535.gif",
    "https://i.imgur.com/HvPID5q.gif",
    "https://i.pinimg.com/originals/9c/94/78/9c9478bb26b2160733ce0c10a0e10d10.gif",
    "https://i.pinimg.com/originals/9d/0d/38/9d0d38c79b9fcf05f3ed71697039d27a.gif",
    "https://i.imgur.com/BWji8Em.gif",
    "https://i.imgur.com/ubJ31Mz.gif"
  ];

  const arrayTag = [
    { id: senderID, tag: senderName },
    { id: loverID, tag: loverName }
  ];

  // Fetch avatars and gif
  const avt1 = (await axios.get(`https://graph.facebook.com/${senderID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" })).data;
  fs.writeFileSync(__dirname + "/cache/avt1.png", Buffer.from(avt1, "utf-8"));

  const avt2 = (await axios.get(`https://graph.facebook.com/${loverID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" })).data;
  fs.writeFileSync(__dirname + "/cache/avt2.png", Buffer.from(avt2, "utf-8"));

  const gif = (await axios.get(gifLinks[Math.floor(Math.random() * gifLinks.length)], { responseType: "arraybuffer" })).data;
  fs.writeFileSync(__dirname + "/cache/love.gif", Buffer.from(gif, "utf-8"));

  const attachments = [
    fs.createReadStream(__dirname + "/cache/avt1.png"),
    fs.createReadStream(__dirname + "/cache/love.gif"),
    fs.createReadStream(__dirname + "/cache/avt2.png")
  ];

  const message = {
    body:
`‎🌸💕 𝗢𝘄𝗻𝗲𝗿 ➻ 𝙊𝙬𝙣𝙚𝙧 ➻ ❤️‍🔥 𝙏𝙖𝙡𝙝𝙖 𝙋𝙖𝙩𝙝𝙖𝙣 ❤️‍🔥

[•|• 𝑨𝒏𝒌𝒉𝒐 𝒎𝒆 𝒃𝒂𝒔𝒂𝒍𝒖 𝒕𝒖𝒋𝒉𝒌𝒐 💙💞
     𝑺𝒉𝒆𝒆𝒔𝒉𝒆 𝒎𝒆 𝒕𝒆𝒓𝒂𝒅𝒆𝒆𝒅𝒂𝒂𝒓 𝒉𝒐..💗🥰🐬 •|•]

✦──────── 💝 ────────✦

[•|• 𝑨𝒌 𝒘𝒂𝒒𝒕 𝒆𝒔𝒂 𝒂𝒂𝒚𝒆 𝒋𝒊𝒏𝒅𝒈𝒊 𝒎𝒆 𝒌𝒊𝒊... 💚💜
     𝒕𝒖𝒋𝒉𝒌𝒐 𝒗 𝒉𝒖𝒎𝒔𝒆 𝒑𝒚𝒂𝒂𝒓 𝒉𝒐 .. 💜❤️✨ •|•]

✦──────── 💝 ────────✦

👤 Name 1: ${senderName}
🆔 ID: ${senderID}

👤 Name 2: ${loverName}
🆔 ID: ${loverID}

🌸 The odds are: 【${compatibility}%】

💘 𝙃𝙊𝙋𝙀 𝙔𝙊𝙐 𝘽𝙊𝙏𝙃 𝙒𝙄𝙇𝙇 𝙎𝙏𝙊𝙋 𝙁𝙇𝙄𝙍𝙏𝙄𝙉𝙂 😏
👑 𝙊𝙒𝙉𝙀𝙍: ✨ 𝗧𝗔𝗟𝗛𝗔 ✨`,
    mentions: arrayTag,
    attachment: attachments
  };

  return api.sendMessage(message, event.threadID, event.messageID);
};
