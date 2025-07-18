module.exports.config = {
  name: "pairv2",
  version: "3.0.0",
  hasPermssion: 0,
  credits: "✨ Fix by Talha ❤️",
  description: "💘 Stylish Love Pairing with Profile Images & Romantic Text",
  commandCategory: "💑 Love",
  usages: "*pairv2",
  cooldowns: 0
};

module.exports.run = async function ({ api, event, Users }) {
  const axios = global.nodemodule["axios"];
  const fs = global.nodemodule["fs-extra"];
  const request = require("request");

  try {
    // 🌟 Get thread info and filter participants
    const threadInfo = await api.getThreadInfo(event.threadID);
    const senderID = event.senderID;
    const botID = api.getCurrentUserID();

    const participants = threadInfo.participantIDs.filter(id => id !== botID && id !== senderID);
    if (participants.length === 0) {
      return api.sendMessage("❌ Pair banane ke liye koi aur member nahi mila.", event.threadID);
    }

    // 💘 Select random lover and get their data
    const loverID = participants[Math.floor(Math.random() * participants.length)];
    const lovePercent = Math.floor(Math.random() * 101);

    const senderData = await Users.getData(senderID);
    const loverData = await Users.getData(loverID);

    const senderName = senderData.name;
    const loverName = loverData.name;

    const mentions = [
      { id: senderID, tag: senderName },
      { id: loverID, tag: loverName }
    ];

    // 🖼️ Download profile pictures
    const senderAvatar = `https://graph.facebook.com/${senderID}/picture?type=large`;
    const loverAvatar = `https://graph.facebook.com/${loverID}/picture?type=large`;

    const img1 = __dirname + `/cache/${senderID}.png`;
    const img2 = __dirname + `/cache/${loverID}.png`;

    const downloadImg = (url, path) =>
      new Promise(resolve => request(url).pipe(fs.createWriteStream(path)).on("close", resolve));

    await downloadImg(senderAvatar, img1);
    await downloadImg(loverAvatar, img2);

    // 💖 Cute GIF for love theme
    const gifURL = "https://i.ibb.co/HHPnMVz/6b0cc1c6326d1099495b6795817d6517.gif";
    const gifPath = __dirname + "/cache/love.gif";

    const gif = await axios.get(gifURL, { responseType: "arraybuffer" });
    fs.writeFileSync(gifPath, Buffer.from(gif.data, "utf-8"));

    // 💌 Romantic Message
    const msg = {
      body:
`🌸💕 𝗢𝘄𝗻𝗲𝗿 ➻ 𝙊𝙬𝙣𝙚𝙧 ➻ ❤️‍🔥 𝙏𝙖𝙡𝙝𝙖 𝙋𝙖𝙩𝙝𝙖𝙣 ❤️‍🔥

[•|• 𝑨𝒏𝒌𝒉𝒐 𝒎𝒆 𝒃𝒂𝒔𝒂𝒍𝒖 𝒕𝒖𝒋𝒉𝒌𝒐. 💙💞 
     𝑺𝒉𝒆𝒆𝒔𝒉𝒆 𝒎𝒆 𝒕𝒆𝒓𝒂𝒅𝒆𝒆𝒅𝒂𝒂𝒓 𝒉𝒐..💗🥰🐬 •|•]

✦──────── 💝 ────────✦

[•|• 𝑨𝒌 𝒘𝒂𝒒𝒕 𝒆𝒔𝒂 𝒂𝒂𝒚𝒆 𝒋𝒊𝒏𝒅𝒈𝒊 𝒎𝒆 𝒌𝒊𝒊... 💚💜 
     𝒕𝒖𝒋𝒉𝒌𝒐 𝒗 𝒉𝒖𝒎𝒔𝒆 𝒑𝒚𝒂𝒂𝒓 𝒉𝒐 .. 💜❤️✨ •|•]

✦──────── 💝 ────────✦

👤 Name 1: ${senderName}
🆔 ID: ${senderID}

👤 Name 2: ${loverName}
🆔 ID: ${loverID}

🌸 The odds are: 【${lovePercent}%】

💘 𝙃𝙊𝙋𝙀 𝙔𝙊𝙐 𝘽𝙊𝙏𝙃 𝙒𝙄𝙇𝙇 𝙎𝙏𝙊𝙋 𝙁𝙇𝙄𝙍𝙏𝙄𝙉𝙂 😏
👑 𝙊𝙒𝙉𝙀𝙍: ✨ 𝗧𝗔𝗟𝗛𝗔 ✨`,
      mentions,
      attachment: fs.createReadStream(gifPath)
    };

    return api.sendMessage(msg, event.threadID, () => {
      fs.unlinkSync(gifPath);
      fs.unlinkSync(img1);
      fs.unlinkSync(img2);
    });

  } catch (err) {
    console.log("❌ pairv2 Error:", err);
    return api.sendMessage("❌ Error aaya pairing mein. Try again later!", event.threadID);
  }
};
