module.exports.config = {
  name: "help",
  version: "1.2.0",
  hasPermssion: 0,
  credits: "Talha ✨",
  description: "Stylish commands list with images",
  commandCategory: "system",
  usages: "help [command | page]",
  cooldowns: 5,
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
    "adminBot": "Bot Admin",
    "helpHeader": "𝐎𝐰𝐧𝐞𝐫 ➻ 𝐓𝐚𝐥𝐡𝐚 𝐏𝐚𝐭𝐡𝐚𝐧\n\n",
    "helpFooter": "\n● ──────────────────── ●\n\n𝐌𝐘 𝐎𝐰𝐧𝐞𝐑 𝐓𝐚𝐥𝐡𝐚 𝐏𝐚𝐭𝐡𝐚𝐧 .... < 𝐄𝐃𝐈𝐓 >\n𝐘𝐞 𝐁𝐨𝐓 𝐒𝐢𝐫𝐟 𝐎𝐰𝐧𝐞𝐑 𝐊 𝐋𝐢𝐲𝐞 𝐇\n𝐌𝐮𝐣𝐡𝐞 𝐀𝐚𝐩 𝐋𝐨𝐠𝐨 𝐊𝐨 𝐇𝐚𝐬𝐚𝐧𝐞 𝐊 𝐋𝐢𝐲𝐞 𝐁𝐚𝐧𝐚𝐲𝐚 𝐆𝐲𝐚 𝐇\n𝐓𝐨𝐡 𝐇𝐚𝐩𝐩𝐲 𝐑𝐞𝐡𝐚𝐧𝐚\n𝐀𝐩𝐤𝐚 𝐀𝐩𝐧𝐚 𝐎𝐰𝐧𝐞𝐑 𝐓𝐚𝐥𝐡𝐚 𝐏𝐚𝐭𝐡𝐚𝐧\n\n● ─────────────────── ●"
  }
};

module.exports.handleEvent = async function ({ api, event, getText }) {
  const { commands } = global.client;
  const { threadID, messageID, body } = event;

  if (!body || !body.toLowerCase().startsWith("help")) return;
  
  const args = body.split(" ").slice(1);
  if (args.length === 0 || !commands.has(args[0].toLowerCase())) return;
  
  const command = commands.get(args[0].toLowerCase());
  const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
  const prefix = threadSetting.PREFIX || global.config.PREFIX;

  const infoText = getText(
    "moduleInfo",
    command.config.name,
    command.config.description,
    `${prefix}${command.config.name} ${command.config.usages || ""}`,
    command.config.commandCategory,
    command.config.cooldowns,
    command.config.hasPermssion == 0 ? getText("user") : 
      (command.config.hasPermssion == 1 ? getText("adminGroup") : getText("adminBot")),
    command.config.credits
  );

  try {
    await api.sendMessage(infoText, threadID, messageID);
  } catch (error) {
    console.error("Error sending help info:", error);
  }
};

module.exports.run = async function ({ api, event, args, getText }) {
  const axios = require("axios");
  const fs = require("fs-extra");
  const { commands } = global.client;
  const { threadID, messageID } = event;
  const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
  const prefix = threadSetting.PREFIX || global.config.PREFIX;

  // Check if specific command help is requested
  if (args[0]) {
    const command = commands.get(args[0].toLowerCase());
    if (command) {
      const infoText = getText(
        "moduleInfo",
        command.config.name,
        command.config.description,
        `${prefix}${command.config.name} ${command.config.usages || ""}`,
        command.config.commandCategory,
        command.config.cooldowns,
        command.config.hasPermssion == 0 ? getText("user") : 
          (command.config.hasPermssion == 1 ? getText("adminGroup") : getText("adminBot")),
        command.config.credits
      );
      
      return api.sendMessage(infoText, threadID, messageID);
    }
  }

  // Show command list
  const page = parseInt(args[0]) || 1;
  const perPage = 10;
  const commandList = Array.from(commands.keys()).sort();
  const totalPages = Math.ceil(commandList.length / perPage);
  
  if (page < 1 || page > totalPages) {
    return api.sendMessage(`Invalid page number. Please choose between 1 and ${totalPages}.`, threadID, messageID);
  }

  const startIdx = (page - 1) * perPage;
  const pageCommands = commandList.slice(startIdx, startIdx + perPage);
  
  let list = pageCommands.map((cmd, i) => {
    return `😈  「 ${startIdx + i + 1} 」${prefix}${cmd}`;
  }).join("\n");

  const body = getText("helpHeader") + 
    list +
    `\n\nPAGE 𒁍 (${page}/${totalPages})\n\n` +
    `𝗖𝗼𝗺𝗺𝗮𝗻𝗱 𝗗𝗲𝘁𝗮𝗶𝗹 ➠ ${prefix}help [command]\n` +
    `𝗔𝗹𝗹 𝗖𝗺𝗱𝘀 ➠ ${prefix}help all\n` +
    getText("helpFooter");

  try {
    // Using a more reliable image URL
    const imgURL = "https://imgur.com/bVfAEoj.jpg"; // Direct image URL
    const path = __dirname + "/cache/help.jpg";
    
    const response = await axios.get(imgURL, { responseType: "arraybuffer" });
    await fs.writeFile(path, Buffer.from(response.data, "binary"));
    
    await api.sendMessage({
      body: body,
      attachment: fs.createReadStream(path)
    }, threadID);
    
    fs.unlinkSync(path);
  } catch (error) {
    console.error("Error sending help image:", error);
    // Fallback to text-only if image fails
    await api.sendMessage(body, threadID, messageID);
  }
};
