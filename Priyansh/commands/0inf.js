module.exports.config = {
  name: "info",
  version: "3.0",
  hasPermssion: 0,
  credits: "Talha",
  description: "info",
  commandCategory: "premium",
  cooldowns: 5,
  dependencies: {
    "axios": "",
    "fs-extra": "",
    "moment-timezone": ""
  }
};

module.exports.run = async function({ api, event }) {
  const fs = global.nodemodule["fs-extra"];
  const axios = global.nodemodule["axios"];
  const moment = require("moment-timezone");
  
  // Uptime calculation
  const uptime = process.uptime();
  const days = Math.floor(uptime / 86400);
  const hours = Math.floor((uptime % 86400) / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = Math.floor(uptime % 60);
  
  // Current time with beautiful formatting
  const timeNow = moment.tz("Asia/Lahore").format("dddd, MMMM Do YYYY | h:mm:ss A");
  
  // Using your direct Imgur link
  const imageURL = "https://i.imgur.com/bVfAEoj.jpg"; 
  const path = __dirname + "/cache/info_image.jpg";

  try {
    const { data } = await axios.get(imageURL, { responseType: "arraybuffer" });
    fs.writeFileSync(path, Buffer.from(data, "binary"));
    
    const poeticMessage = `
✧･ﾟ: *✧･ﾟ:* 𝗕𝗢𝗧 𝗖𝗥𝗬𝗦𝗧𝗔𝗟 𝗜𝗡𝗙𝗢 *:･ﾟ✧*:･ﾟ✧

╔═════ ∘◦ ⛧ ◦∘ ═════╗
    𝗕 𝗢 𝗧  𝗜 𝗡 𝗙 𝗢 
╚═════ ∘◦ ⛧ ◦∘ ═════╝

❃ 𝗡𝗮𝗺𝗲: 『${global.config.BOTNAME}』
✧ 𝗣𝗿𝗲𝗳𝗶𝘅: 『 ${global.config.PREFIX} 』
❋ 𝗢𝘄𝗻𝗲𝗿: 『 𝖳𝖺𝗅𝗁𝖺 』
✺ 𝗖𝗼𝗻𝘁𝗮𝗰𝘁: 『 fb.com/talha 』

╔═════ ∘◦ ❈ ◦∘ ═════╗
     𝗣 𝗢 𝗘 𝗧 𝗥 𝗬 
╚═════ ∘◦ ❈ ◦∘ ═════╝

"𝗕𝗮𝗱𝗻𝗮𝗺 𝗛𝘂𝗺 𝗛𝗼 𝗧𝗼 𝗞𝘆𝗮 𝗛𝘂𝗮,
𝗜𝘀𝗵𝗾 𝗞𝗶 𝗥𝗮𝗵 𝗠𝗲𝗶𝗻 𝗦𝗮𝗯 𝗕𝗮𝗱𝗻𝗮𝗺 𝗛𝗼𝘁𝗲 𝗛𝗮𝗶𝗻"

"𝗧𝘂𝗺 𝗠𝘂𝗷𝗵𝗺𝗲𝗶𝗻 𝗗𝗵𝘂𝗻𝗱𝗼 𝗧𝗼 𝗣𝗮 𝗝𝗮𝗼𝗴𝗲,
𝗬𝗲 𝗗𝗶𝗹 𝗛𝗶 𝗠𝗲𝗿𝗮 𝗚𝗵𝗮𝗿 𝗛𝗮𝗶 𝗧𝘂𝗺𝗵𝗮𝗿𝗮"

╔═════ ∘◦ ✦ ◦∘ ═════╗
     𝗦 𝗬 𝗦 𝗧 𝗘 𝗠 
╚═════ ∘◦ ✦ ◦∘ ═════╝

⏳ 𝗨𝗽𝘁𝗶𝗺𝗲: ${days}d ${hours}h ${minutes}m ${seconds}s
🗓️ 𝗗𝗮𝘁𝗲: ${timeNow}
⚙️ 𝗩𝗲𝗿𝘀𝗶𝗼𝗻: ${global.config.version}

╔═════ ∘◦ ✧ ◦∘ ═════╗
 𝗧 𝗘 𝗖 𝗛 𝗡 𝗢 𝗟 𝗢 𝗚 𝗬 
╚═════ ∘◦ ✧ ◦∘ ═════╝

▸ Node.js ${process.version}
▸ Mirai API Architecture
▸ MongoDB Database
▸ Redis Caching
▸ Cloudflare Protection

✧･ﾟ: *✧･ﾟ:* 𝗘𝗡𝗗 𝗢𝗙 𝗜𝗡𝗙𝗢 *:･ﾟ✧*:･ﾟ✧`;

    return api.sendMessage({
      body: poeticMessage,
      attachment: fs.createReadStream(path)
    }, event.threadID, () => fs.unlinkSync(path));
    
  } catch (error) {
    console.error("Premium Info Error:", error);
    return api.sendMessage("✨ 𝗔𝗻 𝗲𝗿𝗿𝗼𝗿 𝗼𝗰𝗰𝘂𝗿𝗿𝗲𝗱 𝘄𝗵𝗶𝗹𝗲 𝗴𝗲𝗻𝗲𝗿𝗮𝘁𝗶𝗻𝗴 𝘆𝗼𝘂𝗿 𝗽𝗿𝗲𝗺𝗶𝘂𝗺 𝗶𝗻𝗳𝗼𝗿𝗺𝗮𝘁𝗶𝗼𝗻.", event.threadID);
  }
};
