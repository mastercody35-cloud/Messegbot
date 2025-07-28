module.exports.config = {
  name: "inf",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "Siizz",
  description: "Admin and Bot info.",
  commandCategory: "...",
  cooldowns: 1,
  dependencies: {
    "request": "",
    "fs-extra": "",
    "axios": ""
  }
};

module.exports.run = async function({ api, event, args, client, Users, Threads, __GLOBAL, Currencies }) {
  const axios = global.nodemodule["axios"];
  const request = global.nodemodule["request"];
  const fs = global.nodemodule["fs-extra"];
  const time = process.uptime(),
    hours = Math.floor(time / (60 * 60)),
    minutes = Math.floor((time % (60 * 60)) / 60),
    seconds = Math.floor(time % 60);
  const moment = require("moment-timezone");
  var juswa = moment.tz("Asia/Lahore").format("『D/MM/YYYY』 【HH:mm:ss】");

  var link = ["https://imgur.com/bVfAEoj.jpg"];

  var callback = () => api.sendMessage({
    body:
`╭─❍❍❍❍❍❍❍❍❍❍❍❍─╮
        💖 ʙᴏᴛ ɪɴꜰᴏ ꜱʏꜱᴛᴇᴍ  
╰─❍❍❍❍❍❍❍❍❍❍❍❍─╯

🌸 𝗕𝗢𝗧 𝗡𝗔𝗠𝗘: ${global.config.BOTNAME}
👑 𝗢𝗪𝗡𝗘𝗥: 𝐌 𝐓𝐀𝐋𝐇𝐀 (Credit)
💘 𝗥𝗘𝗟𝗔𝗧𝗜𝗢𝗡𝗦𝗛𝗜𝗣:
ʜᴀɪ ᴍᴇʀɪ ᴇᴋ ᴘʏᴀʀɪ ꜱɪ ꜱʜᴇʜᴢᴀᴅɪ 💞
ᴊɪꜱᴇ ᴍᴀɪɴ ᴘʏᴀʀ ꜱᴇ ᴊᴀɴᴀ ᴋᴇʜᴛᴀ 💗

🌐 𝗙𝗔𝗖𝗘𝗕𝗢𝗢𝗞:
📎 https://www.facebook.com/share/193GypVyJQ/

🛠️ 𝗣𝗥𝗘𝗙𝗜𝗫: ${global.config.PREFIX}
⏳ 𝗨𝗣𝗧𝗜𝗠𝗘: ${hours}h ${minutes}m ${seconds}s
📆 𝗧𝗜𝗠𝗘 & 𝗗𝗔𝗧𝗘: ${juswa}

🌷❝ بََدناَمِ تَو بُہتِِ ہُ٘وں اسِِؔں زَمـاَنِِـے مََی٘ں ❞
❝ تُو بَ٘تاََ تَیرِے سُنّنِے مَی٘ں کِِ٘ونَسؔاَ قِ٘ـصََـہ آیاَ ہََـ٘ے ❞ 🥀

╭─────♡─────╮
 💞 ᴛʜᴀɴᴋꜱ ꜰᴏʀ ᴜꜱɪɴɢ ᴍʏ ʙᴏᴛ!
╰─────♡─────╯`,
    attachment: fs.createReadStream(__dirname + "/cache/juswa.jpg")
  }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/juswa.jpg"));

  return request(encodeURI(link[Math.floor(Math.random() * link.length)]))
    .pipe(fs.createWriteStream(__dirname + "/cache/juswa.jpg"))
    .on("close", () => callback());
};
