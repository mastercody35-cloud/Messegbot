module.exports.config = {
  name: "help",
  version: "1.3.0",
  hasPermssion: 0,
  credits: "Talha ✨",
  description: "Stylish commands list with Imgur images",
  commandCategory: "system",
  usages: "help [command | page]",
  cooldowns: 5,
  envConfig: {
    autoUnsend: true,
    delayUnsend: 60
  }
};

module.exports.languages = {
  "en": {
    "moduleInfo": `❖ 𝐂𝐨𝐦𝐦𝐚𝐧𝐝 ➟ %1\n\n📄 𝐃𝐞𝐬𝐜: %2\n⚙️ 𝐔𝐬𝐚𝐠𝐞: %3\n📂 𝐂𝐚𝐭𝐞𝐠𝐨𝐫𝐲: %4\n⏱ 𝐂𝐨𝐨𝐥𝐝𝐨𝐰𝐧: %5s\n🔐 𝐏𝐞𝐫𝐦𝐢𝐬𝐬𝐢𝐨𝐧: %6\n👑 𝐂𝐫𝐞𝐝𝐢𝐭: %7`,
    "user": "User",
    "adminGroup": "Group Admin",
    "adminBot": "Bot Admin",
    "helpHeader": "╔═════≪ •❈• ≫═════╗\n       𝐓𝐀𝐋𝐇𝐀 𝐁𝐎𝐓 𝐇𝐄𝐋𝐏 𝐌𝐄𝐍𝐔\n╚═════≪ •❈• ≫═════╝\n\n",
    "helpFooter": "\n\n╔═════≪ •❈• ≫═════╗\n  𝐎𝐖𝐍𝐄𝐑 ➤ 𝐓𝐀𝐋𝐇𝐀 𝐏𝐀𝐓𝐇𝐀𝐍\n╚═════≪ •❈• ≫═════╝",
    "pageInfo": "📑 𝐏𝐚𝐠𝐞 %1/%2\n\n🔍 𝐓𝐲𝐩𝐞: »help [cmd]« 𝐟𝐨𝐫 𝐝𝐞𝐭𝐚𝐢𝐥𝐬\n🌟 𝐀𝐥𝐥 𝐜𝐦𝐝𝐬: »help all«"
  }
};

module.exports.run = async function ({ api, event, args, getText }) {
  const axios = require("axios");
  const fs = require("fs-extra");
  const { commands } = global.client;
  const { threadID, messageID } = event;
  const prefix = global.config.PREFIX;

  // Handle specific command help
  if (args[0] && commands.has(args[0].toLowerCase())) {
    const command = commands.get(args[0].toLowerCase());
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

  // Handle command list
  const page = parseInt(args[0]) || 1;
  const perPage = 10;
  const commandList = Array.from(commands.keys()).sort();
  const totalPages = Math.ceil(commandList.length / perPage);
  
  if (page < 1 || page > totalPages) {
    return api.sendMessage(`Invalid page. Available pages: 1-${totalPages}`, threadID, messageID);
  }

  const startIdx = (page - 1) * perPage;
  const pageCommands = commandList.slice(startIdx, startIdx + perPage);
  
  let list = pageCommands.map((cmd, i) => {
    return `✨ ${startIdx + i + 1}. ${prefix}${cmd}`;
  }).join("\n");

  const body = getText("helpHeader") + 
    list + "\n\n" +
    getText("pageInfo", page, totalPages) +
    getText("helpFooter");

  try {
    // Using direct Imgur URL (replace with your own image)
    const imgURL = "https://i.imgur.com/3ZQZQ9M.jpg"; // Your Imgur image direct link
    
    // Download image
    const path = __dirname + "/cache/help.jpg";
    const response = await axios.get(imgURL, { 
      responseType: "arraybuffer",
      headers: {
        "Referer": "https://imgur.com/"
      }
    });
    
    await fs.writeFile(path, response.data);
    
    // Send message with image
    await api.sendMessage({
      body: body,
      attachment: fs.createReadStream(path)
    }, threadID, () => fs.unlinkSync(path), messageID);
    
  } catch (error) {
    console.error("Error sending help:", error);
    // Fallback to text if image fails
    await api.sendMessage(body, threadID, messageID);
  }
};
