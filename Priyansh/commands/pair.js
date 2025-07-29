module.exports.config = {
  name: "pair",
  version: "1.0.0", 
  hasPermssion: 0,
  credits: "ALI BABA + Modified by Talha",
  description: "pairing",
  commandCategory: "Love", 
  usages: "pair", 
  cooldowns: 10
};

module.exports.run = async function({ api, event, Threads, Users }) {
  const axios = global.nodemodule["axios"];
  const fs = global.nodemodule["fs-extra"];

  var { participantIDs } = (await Threads.getData(event.threadID)).threadInfo;
  var tle = Math.floor(Math.random() * 101);
  var namee = (await Users.getData(event.senderID)).name;
  const botID = api.getCurrentUserID();
  const listUserID = event.participantIDs.filter(ID => ID != botID && ID != event.senderID);
  var id = listUserID[Math.floor(Math.random() * listUserID.length)];
  var name = (await Users.getData(id)).name;
  var arraytag = [];

  const gifCute = [
    "https://i.pinimg.com/originals/42/9a/89/429a890a39e70d522d52c7e52bce8535.gif",
    "https://i.imgur.com/HvPID5q.gif",
    "https://i.pinimg.com/originals/9c/94/78/9c9478bb26b2160733ce0c10a0e10d10.gif",
    "https://i.pinimg.com/originals/9d/0d/38/9d0d38c79b9fcf05f3ed71697039d27a.gif",
    "https://i.imgur.com/BWji8Em.gif",
    "https://i.imgur.com/ubJ31Mz.gif"
  ];

  arraytag.push({ id: event.senderID, tag: namee });
  arraytag.push({ id: id, tag: name });

  const shayariList = [
    "❝ تمہارے بعد کسی کو دل میں جگہ نہ دی 💔\nکیونکہ تم جو گئے دل ہی لے گئے ❞",
    "❝ میری آنکھوں میں چھپی تیری چاہت ہے 💖\nتو سامنے ہو پھر بھی تیری ہی کمی ہے ❞",
    "❝ تم ملے تو لگا ہر خوشی مل گئی ✨\nتیری مسکراہٹ میری بندگی بن گئی ❣️ ❞",
    "❝ نہ فاصلے دلوں میں رہیں، نہ شکایتیں باقی ہوں 💖\nتم میرے ہو بس، یہ بات سب پہ عیاں ہو جائے 🌙 ❞",
    "❝ تیرے بغیر ادھورا ہوں میں 🌌\nتو جو پاس ہو تو مکمل لگتا ہوں 💞 ❞",
    "❝ تیری خاموشی بھی محبت کی زبان لگتی ہے 🌷\nتُو پاس ہو تو ہر شے آسان لگتی ہے 💘 ❞"
  ];
  const randomPoetry = shayariList[Math.floor(Math.random() * shayariList.length)];

  let Avatar = (await axios.get(`https://graph.facebook.com/${event.senderID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" })).data;
  fs.writeFileSync(__dirname + "/cache/avt.png", Buffer.from(Avatar, "utf-8"));

  let gifLove = (await axios.get(gifCute[Math.floor(Math.random() * gifCute.length)], { responseType: "arraybuffer" })).data;
  fs.writeFileSync(__dirname + "/cache/giflove.png", Buffer.from(gifLove, "utf-8"));

  let Avatar2 = (await axios.get(`https://graph.facebook.com/${id}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" })).data;
  fs.writeFileSync(__dirname + "/cache/avt2.png", Buffer.from(Avatar2, "utf-8"));

  var imglove = [
    fs.createReadStream(__dirname + "/cache/avt.png"),
    fs.createReadStream(__dirname + "/cache/giflove.png"),
    fs.createReadStream(__dirname + "/cache/avt2.png")
  ];

  // 💎 Stylish Final Message Body
  var msg = {
    body: `╔═━━━✦✗✦━━━═╗
💘 𝑪𝒐𝒖𝒑𝒍𝒆 𝑪𝒐𝒏𝒏𝒆𝒄𝒕𝒆𝒅 𝑩𝒚 𝑭𝒂𝒕𝒆 💘
╚═━━━✦✗✦━━━═╝

🖤👉𓆩 ${namee} 𓆪


 ─── ⋆⋅☆⋅⋆ ───

🖤👉 𓆩 ${name} 𓆪

─── ⋆⋅☆⋅⋆ ───

❤️‍🔥 𝐋𝐨𝐯𝐞 𝐌𝐚𝐭𝐜𝐡: ${tle}%

🖋️ 𝐒𝐡𝐚𝐲𝐚𝐫𝐢 𝐎𝐟 𝐓𝐡𝐞 𝐌𝐨𝐦𝐞𝐧𝐭:
✨ ❝ ${randomPoetry} ❞

🎀 𝐎𝐰𝐧𝐞𝐫 𝐓𝐚𝐥𝐡𝐚:
👑 𝐌𝐨𝐭𝐨 𝐁𝐨𝐭 ┃ 𝐓𝐡𝐞 𝐋𝐨𝐯𝐞 𝐌𝐚𝐬𝐭𝐞𝐫 💌`,
    mentions: arraytag,
    attachment: imglove
  };

  return api.sendMessage(msg, event.threadID, event.messageID);
};
