const fs = require("fs-extra");
const axios = require("axios");
const request = require("request");

module.exports.config = {
  name: "help",
  version: "2.3.0",
  hasPermssion: 0,
  credits: "Talha ✨",
  description: "Stylish command list with 10/page",
  commandCategory: "system",
  usages: "help [command | page]",
  cooldowns: 3
};

module.exports.run = async ({ api, event, args }) => {
  const allCommands = global.client.commands.values();
  const commandList = Array.from(allCommands);

  const page = parseInt(args[0]) || 1;
  const commandsPerPage = 10;
  const totalPages = Math.ceil(commandList.length / commandsPerPage);
  const start = (page - 1) * commandsPerPage;
  const end = start + commandsPerPage;

  if (page < 1 || page > totalPages) {
    return api.sendMessage(`❌ Page not found. Total pages: ${totalPages}`, event.threadID);
  }

  const pageCommands = commandList.slice(start, end);

  const commandInfo = pageCommands.map((cmd, index) => {
    return `✨ 𝗡𝗮𝗺𝗲: ${cmd.config.name}\n📘 𝗨𝘀𝗮𝗴𝗲: ${cmd.config.usages || "No usage"}\n🧩 𝗗𝗲𝘀𝗰: ${cmd.config.description || "No description"}\n────────────────────────────`;
  }).join("\n");

  const header = `
╔═════≪ •❈• ≫═════╗
     🄼🄾🅃🄾🄱🄾🅃 
╚═════≪ •❈• ≫═════╝`;

  const footer = `
╭───『 ✨ 𝗢𝗪𝗡𝗘𝗥 𝗠𝗘𝗦𝗦𝗔𝗚𝗘 』───╮
│
│ ❝ 𝐓𝐇𝐈𝐒 𝐁𝐎𝐓 𝐈𝐒 𝐌𝐀𝐃𝐄 𝐒𝐏𝐄𝐂𝐈𝐀𝐋𝐋𝐘
│   𝐅𝐎𝐑 𝐌𝐘 𝐎𝐖𝐍𝐄𝐑 — 𝐓𝐀𝐋𝐇𝐀 𝐏𝐀𝐓𝐇𝐀𝐍 ❞
|    
│ 🌟 𝐄𝐍𝐉𝐎𝐘 𝐓𝐇𝐄 𝐁𝐎𝐓 𝐀𝐍𝐃 𝐁𝐄 𝐒𝐌𝐈𝐋𝐄!
│ 💌 𝐂𝐎𝐍𝐓𝐀𝐂𝐓: 𝐅𝐛:https://www.facebook.com/share/193GypVyJQ/
│
╰───『 Page: ${page}/${totalPages} 』───╯`;

  // Stylish image (update link if needed)
  const imgUrl = "https://ibb.co/SwqCYqLz";
  const pathImg = __dirname + "/help.jpg";

  const writeImg = () => new Promise((resolve, reject) => {
    request(encodeURI(imgUrl))
      .pipe(fs.createWriteStream(pathImg))
      .on("close", () => resolve())
      .on("error", (err) => reject(err));
  });

  try {
    await writeImg();

    api.sendMessage({
      body: `${header}\n\n${commandInfo}\n\n${footer}`,
      attachment: fs.createReadStream(pathImg)
    }, event.threadID, () => fs.unlinkSync(pathImg), event.messageID);
  } catch (error) {
    api.sendMessage(`${header}\n\n${commandInfo}\n\n${footer}`, event.threadID, event.messageID);
  }
};
