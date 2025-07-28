const fs = require("fs-extra");
const axios = require("axios");
const request = require("request");

module.exports.config = {
  name: "help",
  version: "2.3.1",
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

  const separator = "╭─────────────༺❀༻─────────────╮";

  const commandInfo = pageCommands.map((cmd, index) => {
    return `✨ 𝙉𝘼𝙈𝙀: 『 ${cmd.config.name} 』\n${separator}`;
  }).join("\n");

  const header = `╔═━━━━━━━━❖🌸❖━━━━━━━━═╗\n      🅃🄰🄻🄷🄰 🄱🄾🅃 \n╚═━━━━━━━━❖🌸❖━━━━━━━━═╝`;

  const footer = `╭─『 💖 𝙊𝙒𝙉𝙀𝙍 𝙈𝙀𝙎𝙎𝘼𝙂𝙀 💖 』─╮\n│ ❝ 𝑻𝒉𝒊𝒔 𝒃𝒐𝒕 𝒊𝒔 𝒃𝒖𝒊𝒍𝒕 𝒇𝒐𝒓 𝑻𝒂𝒍𝒉𝒂 𝑷𝒂𝒕𝒉𝒂𝒏 ❞\n│ ✨ 𝑬𝒏𝒋𝒐𝒚 𝑼𝒔𝒊𝒏𝒈 𝑻𝒉𝒂 𝑩𝒐𝒕 & 𝑺𝒑𝒓𝒆𝒂𝒅 𝑳𝒐𝒗𝒆\n│ 🌐 fb.com/share/talha/\n╰─『 Page: ${page}/${totalPages} 』─╯`;

  const imgUrl = "https://i.imgur.com/bVfAEoj.jpeg";
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
