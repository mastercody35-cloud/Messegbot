module.exports.config = {
  name: "help",
  version: "1.1.0",
  hasPermssion: 0,
  credits: "Talha ✨",
  description: "Stylish commands list",
  commandCategory: "system",
  usages: "help [name | page]",
  cooldowns: 1,
  envConfig: {
    autoUnsend: false,
    delayUnsend: 300
  }
};

module.exports.languages = {
  "en": {
    "moduleInfo": `❖ 𝐂𝐨𝐦𝐦𝐚𝐧𝐝 ➟ %1\n\n📄 𝐃𝐞𝐬𝐜: %2\n⚙️ 𝐔𝐬𝐚𝐠𝐞: %3\n📂 𝐂𝐚𝐭𝐞𝐠𝐨𝐫𝐲: %4\n⏱ 𝐂𝐨𝐨𝐥𝐝𝐨𝐰𝐧: %5s\n🔐 𝐏𝐞𝐫𝐦𝐢𝐬𝐬𝐢𝐨𝐧: %6\n👑 𝐂𝐫𝐞𝐝𝐢𝐭: %7`,
    "user": "User",
    "adminGroup": "Group Admin",
    "adminBot": "Bot Admin"
  }
};

module.exports.handleEvent = function ({ api, event, getText }) {
  const { commands } = global.client;
  const { threadID, messageID, body } = event;

  if (!body || typeof body == "undefined" || body.indexOf("help") != 0) return;
  const splitBody = body.slice(body.indexOf("help")).trim().split(/\s+/);
  if (splitBody.length == 1 || !commands.has(splitBody[1].toLowerCase())) return;
  const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
  const command = commands.get(splitBody[1].toLowerCase());
  const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;

  return api.sendMessage(
    getText("moduleInfo",
      command.config.name,
      command.config.description,
      `${prefix}${command.config.name} ${command.config.usages || ""}`,
      command.config.commandCategory,
      command.config.cooldowns,
      command.config.hasPermssion == 0 ? getText("user") : (command.config.hasPermssion == 1 ? getText("adminGroup") : getText("adminBot")),
      command.config.credits
    ), threadID, messageID
  );
};

module.exports.run = async function ({ api, event, args, getText }) {
  const axios = require("axios");
  const request = require("request");
  const fs = require("fs-extra");
  const { commands } = global.client;
  const { threadID, messageID } = event;
  const command = commands.get((args[0] || "").toLowerCase());
  const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
  const { autoUnsend, delayUnsend } = global.configModule[this.config.name];
  const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;

  if (!command) {
    const page = parseInt(args[0]) || 1;
    const perPage = 10;
    const total = commands.size;
    const totalPages = Math.ceil(total / perPage);
    let i = (page - 1) * perPage;

    const list = Array.from(commands.keys())
      .sort()
      .slice(i, i + perPage)
      .map(cmd => `😈  「 ${++i} 」${prefix}${cmd}`)
      .join("\n");

    const body =
`𝐎𝐰𝐧𝐞𝐫 ➻   𝐓𝐚𝐥𝐡𝐚 𝐏𝐚𝐭𝐡𝐚𝐧\n
${list}

PAGE 𒁍 (${page}/${totalPages})

𝗖𝗼𝗺𝗺𝗮𝗻𝗱 𝗗𝗲𝘁𝗮𝗶𝗹 ➠ help [command]
𝗔𝗹𝗹 𝗖𝗺𝗱𝘀 ➠ help all

● ──────────────────── ●

𝐌𝐘 𝐎𝐰𝐧𝐞𝐑 𝐓𝐚𝐥𝐡𝐚 𝐏𝐚𝐭𝐡𝐚𝐧 .... < 𝐄𝐃𝐈𝐓 >
𝐘𝐞 𝐁𝐨𝐓 𝐒𝐢𝐫𝐅 𝐎𝐰𝐧𝐞𝐑 𝐊 𝐋𝐢𝐘𝐞 𝐇
𝐌𝐮𝐣𝐇𝐞 𝐀𝐚𝐩 𝐋𝐨𝐆𝐨 𝐊𝐨 𝐇𝐚𝐬𝐚𝐍𝐞 𝐊 𝐋𝐢𝐘𝐞 𝐁𝐚𝐧𝐘𝐚 𝐆𝐲𝐚 𝐇
𝐓𝐨𝐇 𝐇𝐚𝐩𝐩𝐘 𝐑𝐞𝐇𝐚𝐍𝐀
𝐀𝐩𝐤𝐚 𝐀𝐩𝐧𝐚 𝐎𝐰𝐧𝐞𝐑 𝐓𝐚𝐥𝐡𝐚 𝐏𝐚𝐭𝐡𝐚𝐧

● ─────────────────── ●`;

    const img = "https://l.facebook.com/l.php?u=https%3A%2F%2Fi.ibb.co%2Fv42ny2tS%2FMessenger-creation-23880101231662584.jpg&h=AT3rJtJ4Bx1cjeX7ULBr5-ue9fL_BSDjI8fqJy9aUqQe1oGIk_bYRgv7Bu8caE09CQkugs27QrJjWhrEtViF3EYMdIOd_pCNOdp32dBlBI0vVc8Ow-lbu0_2dRnht-1RAQBIN7AgLoz_vzo&s=1";
    const path = __dirname + "/cache/help.jpg";

    request(encodeURI(img)).pipe(fs.createWriteStream(path)).on("close", () => {
      api.sendMessage({
        body,
        attachment: fs.createReadStream(path)
      }, threadID, () => fs.unlinkSync(path), messageID);
    });
    return;
  }

  const infoText = getText("moduleInfo",
    command.config.name,
    command.config.description,
    `${prefix}${command.config.name} ${command.config.usages || ""}`,
    command.config.commandCategory,
    command.config.cooldowns,
    command.config.hasPermssion == 0 ? getText("user") : (command.config.hasPermssion == 1 ? getText("adminGroup") : getText("adminBot")),
    command.config.credits
  );

  const img = "https://i.imgur.com/oQWy3Ax.jpg";
  const path = __dirname + "/cache/help.jpg";

  request(encodeURI(img)).pipe(fs.createWriteStream(path)).on("close", () => {
    api.sendMessage({
      body: infoText,
      attachment: fs.createReadStream(path)
    }, threadID, () => fs.unlinkSync(path), messageID);
  });
};
