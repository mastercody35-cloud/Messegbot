const fs = global.nodemodule["fs-extra"];
const axios = global.nodemodule["axios"];
const moment = require("moment-timezone");
const si = global.nodemodule["systeminformation"];
const os = require("os");

module.exports.config = {
  name: "info",
  version: "3.1",
  hasPermssion: 0,
  credits: "Talha",
  description: "Premium bot information system",
  commandCategory: "premium",
  cooldowns: 5,
  dependencies: {
    "axios": "",
    "fs-extra": "",
    "moment-timezone": "",
    "systeminformation": ""
  }
};

module.exports.run = async function({ api, event }) {
  try {
    const [time, cpu, mem] = await Promise.all([
      si.time(),
      si.cpu(),
      si.mem()
    ]);

    const uptime = process.uptime();
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);

    const timeNow = moment.tz("Asia/Karachi").format("dddd, MMMM Do YYYY | h:mm:ss A");

    const imageURLs = [
      "https://i.imgur.com/bVfAEoj.jpg",
      "https://i.ibb.co/3Rcbt7z/fbinfo.jpg" // fallback
    ];

    const path = __dirname + "/cache/info_image.jpg";
    let imageSuccess = false;

    for (const url of imageURLs) {
      try {
        const { data } = await axios.get(url, { responseType: "arraybuffer" });
        fs.writeFileSync(path, Buffer.from(data, "binary"));
        imageSuccess = true;
        break;
      } catch (err) {
        console.error(`Image failed from ${url}: ${err.message}`);
      }
    }

    const adminIDs = global.config.ADMINBOT || [];
    let ownerInfo = "Talha (Default)";
    
    if (adminIDs.length > 0) {
      try {
        const userInfo = await api.getUserInfo(adminIDs[0]);
        if (userInfo && userInfo[adminIDs[0]]) {
          ownerInfo = userInfo[adminIDs[0]].name || ownerInfo;
        }
      } catch (error) {
        console.error("Owner info fetch failed:", error.message);
      }
    }

    const botName = global.config.BOTNAME || "Unknown Bot";
    const prefix = global.config.PREFIX || "!";
    const botVersion = global.config.version || "1.0.0";
    const cpuBrand = cpu?.manufacturer + " " + cpu?.brand || "Unknown CPU";
    const cpuCores = cpu?.cores || "N/A";
    const ramSize = (mem.total / 1024 / 1024 / 1024).toFixed(2);

    const poeticMessage = `
✧･ﾟ: *✧･ﾟ:* 𝗕𝗢𝗧 𝗖𝗥𝗬𝗦𝗧𝗔𝗟 𝗜𝗡𝗙𝗢 *:･ﾟ✧*:･ﾟ✧

╔═════ ∘◦ ⛧ ◦∘ ═════╗
    𝗕 𝗢 𝗧  𝗜 𝗡 𝗙 𝗢 
╚═════ ∘◦ ⛧ ◦∘ ═════╝

❃ 𝗡𝗮𝗺𝗲: 『${botName}』
✧ 𝗣𝗿𝗲𝗳𝗶𝘅: 『 ${prefix} 』
❋ 𝗢𝘄𝗻𝗲𝗿: 『 ${ownerInfo} 』
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
⚙️ 𝗩𝗲𝗿𝘀𝗶𝗼𝗻: ${botVersion}
💻 𝗖𝗣𝘂: ${cpuBrand}
🧠 𝗥𝗔𝗠: ${ramSize} GB

╔═════ ∘◦ ✧ ◦∘ ═════╗
 𝗧 𝗘 𝗖 𝗛 𝗡 𝗢 𝗟 𝗢 𝗚 𝗬 
╚═════ ∘◦ ✧ ◦∘ ═════╝

▸ Node.js ${process.version}
▸ ${cpuCores} CPU Cores
▸ ${os.platform()} ${os.release()}
▸ MongoDB Database
▸ Redis Caching
▸ Cloudflare Protection

✧･ﾟ: *✧･ﾟ:* 𝗘𝗡𝗗 𝗢𝗙 𝗜𝗡𝗙𝗢 *:･ﾟ✧*:･ﾟ✧`;

    const messageOptions = {
      body: poeticMessage
    };

    if (imageSuccess) {
      messageOptions.attachment = fs.createReadStream(path);
    }

    return api.sendMessage(messageOptions, event.threadID, () => {
      if (imageSuccess) fs.unlinkSync(path);
    });

  } catch (error) {
    console.error("Premium Info Error:", error);
    return api.sendMessage("❌ 𝗘𝗿𝗿𝗼𝗿 𝗳𝗲𝘁𝗰𝗵𝗶𝗻𝗴 𝗶𝗻𝗳𝗼! ➤ " + error.message, event.threadID);
  }
};
