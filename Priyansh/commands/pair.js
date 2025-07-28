const axios = require("axios");
const fs = require("fs-extra");

module.exports.config = {
  name: "pair",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Anup Kumar | Fixed by Talha",
  description: "Pairing system for love",
  commandCategory: "Love",
  usages: "pair",
  cooldowns: 0
};

module.exports.run = async function({ api, event, Threads, Users }) {
  try {
    const { participantIDs } = (await Threads.getData(event.threadID)).threadInfo;
    const botID = api.getCurrentUserID();
    const senderID = event.senderID;
    const namee = (await Users.getData(senderID)).name;
    const listUserID = participantIDs.filter(id => id != botID && id != senderID);

    if (listUserID.length === 0) return api.sendMessage("⚠️ Group ma aur koi user nahi mila pairing k liye!", event.threadID, event.messageID);

    let id = listUserID[Math.floor(Math.random() * listUserID.length)];
    let tle = Math.floor(Math.random() * 101);

    // Custom pairing overrides
    if (senderID == 100052886831202) id = 100042292561861;
    if (senderID == 100042292561861) id = 100052886831202;
    if (senderID == 100063142031840) {
      id = 100080347467595;
      tle = 1000;
    }

    const name = (await Users.getData(id)).name;
    const arraytag = [
      { id: senderID, tag: namee },
      { id: id, tag: name }
    ];

    // Fetch avatars
    const avatar1 = (await axios.get(`https://graph.facebook.com/${senderID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(__dirname + "/cache/avt1.png", Buffer.from(avatar1, "utf-8"));

    const avatar2 = (await axios.get(`https://graph.facebook.com/${id}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(__dirname + "/cache/avt2.png", Buffer.from(avatar2, "utf-8"));

    const gifLove = (await axios.get("https://i.ibb.co/HHPnMVz/6b0cc1c6326d1099495b6795817d6517.gif", { responseType: "arraybuffer" })).data;
    fs.writeFileSync(__dirname + "/cache/giflove.gif", Buffer.from(gifLove, "utf-8"));

    // Love messages
    const hemang = [
      "𝑻𝒖𝒎 𝒎𝒆𝒓𝒊 𝒛𝒊𝒏𝒅𝒂𝒈𝒊 𝒌𝒊 𝒔𝒂𝒃𝒔𝒆 𝒌𝒉𝒐𝒐𝒃𝒔𝒖𝒓𝒂𝒕 𝒃𝒂𝒂𝒕 𝒉𝒐 ❤️",
      "𝑻𝒖𝒎𝒉𝒂𝒓𝒊 𝒎𝒖𝒔𝒌𝒖𝒓𝒂𝒉𝒂𝒕 𝒔𝒆 𝒉𝒊 𝒎𝒆𝒓𝒊 𝒔𝒖𝒃𝒂𝒉 𝒌𝒉𝒊𝒍𝒕𝒊 𝒉𝒂𝒊 🌸",
      "𝐒𝐀𝐁 𝐒𝐘 𝐀𝐂𝐇𝐈 𝐉𝐎𝐃𝐈 𝐖𝐀𝐇 💖",
      "𝐌𝐎𝐓𝐎 𝐎𝐑 𝐏𝐀𝐓𝐋𝐔 𝐊𝐈 𝐉𝐎𝐃𝐈 😂",
      "𝐉𝐀𝐎 𝐈𝐍𝐁𝐎𝐗 𝐌𝐀 𝐋𝐎𝐍𝐃𝐀𝐁𝐀𝐙𝐈 𝐊𝐑𝐎💞",
      "𝐀𝐊 𝐃𝐔𝐒𝐑𝐘 𝐊𝐎 𝐊𝐈𝐒𝐒 𝐃𝐎 𝐀𝐁 😂😏",
      "🌸𝐀𝐁 𝐃𝐎𝐍𝐎 𝐆𝐅 𝐁𝐅 𝐇𝐎 😝"
    ];
    const sheoran = hemang[Math.floor(Math.random() * hemang.length)];

    const attachments = [
      fs.createReadStream(__dirname + "/cache/avt1.png"),
      fs.createReadStream(__dirname + "/cache/giflove.gif"),
      fs.createReadStream(__dirname + "/cache/avt2.png")
    ];

    const msg = {
      body: `🥰𝐏𝐀𝐈𝐑𝐈𝐍𝐆!🍒\n\n💙🅂🆄︎🄲🅲︎🄴🆂︎🅂🅵︎🅄🅻︎❤️\n\n𝐀𝐚𝐩 𝐃𝐨𝐧𝐨 𝐀𝐛 𝐁𝐟 𝐆𝐟 𝐁𝐚𝐧 𝐠𝐲𝐞 💞\n\n💘 𝗟𝗼𝘃𝗲 𝗥𝗮𝘁𝗶𝗼: ${tle}%\n\n${namee} 💓 ${name}\n👉 ${sheoran}\n\n𝐓𝐀𝐋𝐇𝐀 𝐏𝐀𝐓𝐇𝐀𝐍❤️🫰`,
      mentions: arraytag,
      attachment: attachments
    };

    return api.sendMessage(msg, event.threadID, event.messageID);
  } catch (err) {
    console.error("PAIR COMMAND ERROR:", err);
    return api.sendMessage("❌ Error in pairing. Please try again later.", event.threadID, event.messageID);
  }
};
