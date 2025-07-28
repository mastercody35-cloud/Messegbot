const axios = require("axios");
const request = require("request");
const fs = require("fs-extra");

module.exports.config = {
  name: "help",
  version: "1.0.2",
  hasPermssion: 0,
  credits: "Talha Pathan ✨",
  description: "Stylish command list",
  commandCategory: "system",
  usages: "help [command | page | all]",
  cooldowns: 1,
  envConfig: {
    autoUnsend: false,
    delayUnsend: 300
  }
};

module.exports.languages = {
  "en": {
    "moduleInfo": "─────[ %1 ]──────\n\nUsage: %3\nCategory: %4\nWaiting time: %5 seconds(s)\nPermission: %6\nDescription: %2\n\nModule coded by %7",
    "user": "User",
    "adminGroup": "Admin group",
    "adminBot": "Admin bot"
  }
};

module.exports.handleEvent = function ({ api, event, getText }) {
  const { commands } = global.client;
  const { threadID, messageID, body } = event;
  if (!body || typeof body == "undefined" || body.indexOf("help") != 0) return;
  const splitBody = body.slice(body.indexOf("help")).trim().split(/\s+/);
  if (splitBody.length == 1 || !commands.has(splitBody[1].toLowerCase()])) return;
  const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
  const command = commands.get(splitBody[1].toLowerCase());
  const prefix = threadSetting.PREFIX || global.config.PREFIX;

  return api.sendMessage(
    getText(
      "moduleInfo",
      command.config.name,
      command.config.description,
      `${prefix}${command.config.name} ${command.config.usages || ""}`,
      command.config.commandCategory,
      command.config.cooldowns,
      (command.config.hasPermssion == 0)
        ? getText("user")
        : (command.config.hasPermssion == 1)
        ? getText("adminGroup")
        : getText("adminBot"),
      command.config.credits
    ),
    threadID,
    messageID
  );
};

module.exports.run = async function ({ api, event, args, getText }) {
  const { commands } = global.client;
  const { threadID, messageID } = event;
  const page = parseInt(args[0]) || 1;
  const numberOfOnePage = 10;
  const data = Array.from(commands.keys());
  const totalPage = Math.ceil(data.length / numberOfOnePage);
  const start = numberOfOnePage * (page - 1);
  const end = start + numberOfOnePage;
  const list = data.slice(start, end);

  let commandList = list.map((name, index) => `▣ ${start + index + 1}. !${name}`).join('\n');

  const body = `╔═════≪ •❈• ≫═════╗
   🄼🄾🅃🄾🄱🄾🅃 2.1
╚═════≪ •❈• ≫═════╝

${commandList}

╭───『 ✨ 𝗢𝗪𝗡𝗘𝗥 𝗠𝗘𝗦𝗦𝗔𝗚𝗘 』───╮
│
│ ❝ 𝐓𝐇𝐈𝐒 𝐁𝐎𝐓 𝐈𝐒 𝐌𝐀𝐃𝐄 𝐒𝐏𝐄𝐂𝐈𝐀𝐋𝐋𝐘
│ 𝐅𝐎𝐑 𝐌𝐘 𝐎𝐖𝐍𝐄𝐑 𝐓𝐀𝐋𝐇𝐀 𝐏𝐀𝐓𝐇𝐀𝐍! ❞
│
│ 🌟 𝐔𝐒𝐄 𝐈𝐓 𝐓𝐎 𝐌𝐀𝐊𝐄 𝐏𝐄𝐎𝗣𝗟𝗘 𝗦𝗠𝗜𝗟𝗘
│ 🎉 𝐒𝐓𝐀𝐘 𝐇𝐀𝐏𝐏𝐘 & 𝐄𝗡𝗝𝗢𝗬!
│
╰───『 © 𝐓𝐚𝐥𝐡𝐚 𝐏𝐚𝐭𝐡𝐚𝐧 』───╯\n\n📄 𝗣𝗔𝗚𝗘: ${page}/${totalPage}`;

  const image = "https://imgur.com/bVfAEoj.jpg";
  const filePath = __dirname + "/cache/helpimg.jpg";

  const callback = () =>
    api.sendMessage(
      {
        body,
        attachment: fs.createReadStream(filePath),
      },
      threadID,
      () => fs.unlinkSync(filePath),
      messageID
    );

  return request(encodeURI(image))
    .pipe(fs.createWriteStream(filePath))
    .on("close", callback);
};
