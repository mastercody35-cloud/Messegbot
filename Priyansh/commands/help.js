const axios = require("axios");
const fs = require("fs-extra");

module.exports.config = {
  name: "help",
  version: "1.0.3",
  hasPermssion: 0,
  credits: "Talha Pathan ✨",
  description: "Stylish command list",
  commandCategory: "system",
  usages: "help [page]",
  cooldowns: 5,
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
  
  if (!body || typeof body == "undefined" || !body.toLowerCase().startsWith("help")) return;
  
  const splitBody = body.slice(body.indexOf("help")).trim().split(/\s+/);
  if (splitBody.length == 1 || !commands.has(splitBody[1].toLowerCase())) return;
  
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
  try {
    const { commands } = global.client;
    const { threadID, messageID } = event;
    const page = parseInt(args[0]) || 1;
    const numberOfOnePage = 10;
    const commandArray = Array.from(commands.values());
    const totalPage = Math.ceil(commandArray.length / numberOfOnePage);
    
    if (page < 1 || page > totalPage) {
      return api.sendMessage(`Invalid page number. Please enter a number between 1 and ${totalPage}.`, threadID, messageID);
    }
    
    const start = numberOfOnePage * (page - 1);
    const end = start + numberOfOnePage;
    const pageCommands = commandArray.slice(start, end);
    
    let commandList = pageCommands.map((cmd, index) => {
      return `▣ ${start + index + 1}. ${cmd.config.name} - ${cmd.config.description}`;
    }).join('\n');

    const body = `╔═════≪ •❈• ≫═════╗
   🄶🄸🄾🄱🄾🅃 🅅2.1
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

    // Try to send with image first
    try {
      const imageURL = "https://i.imgur.com/oQWy3Ax.jpg";
      const path = __dirname + '/cache/help.jpg';
      
      const getImage = await axios.get(imageURL, { responseType: 'arraybuffer' });
      fs.writeFileSync(path, Buffer.from(getImage.data, 'utf-8'));
      
      return api.sendMessage({
        body: body,
        attachment: fs.createReadStream(path)
      }, threadID, () => fs.unlinkSync(path), messageID);
    } catch (imageError) {
      console.error("Image error:", imageError);
      // If image fails, send without image
      return api.sendMessage(body, threadID, messageID);
    }
  } catch (err) {
    console.error(err);
    return api.sendMessage("An error occurred while processing the help command.", threadID, messageID);
  }
};
