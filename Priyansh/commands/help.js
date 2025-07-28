module.exports.config = {
  name: "help",
  version: "2.2.0",
  hasPermssion: 0,
  credits: "Talha ✨",
  description: "🔮 Ultimate Command List with 10 Commands/Page",
  commandCategory: "system",
  usages: "help [command]",
  cooldowns: 3
};

module.exports.languages = {
  "en": {
    "moduleInfo": `┌──『 ✦ 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗜𝗡𝗙𝗢 』✦──┐
    
▢ 𝗡𝗮𝗺𝗲 ➤ ${prefix}%1
▢ 𝗗𝗲𝘀𝗰 ➤ %2
▢ 𝗨𝘀𝗮𝗴𝗲 ➤ %3
▢ 𝗖𝗮𝘁𝗲𝗴𝗼𝗿𝘆 ➤ %4
▢ 𝗖𝗼𝗼𝗹𝗱𝗼𝘄𝗻 ➤ %5s
▢ 𝗣𝗲𝗿𝗺𝘀 ➤ %6
▢ 𝗖𝗿𝗲𝗱𝗶𝘁𝘀 ➤ %7

└───✦✧✦───┘`,
    "helpHeader": `╔═════≪ •❈• ≫═════╗
   🄼🄾🅃🄾🄱🄾🅃 2.2
╚═════≪ •❈• ≫═════╝

👑 𝗢𝘄𝗻𝗲𝗿 ➤ 𝐓𝐚𝐥𝐡𝐚 𝐏𝐚𝐭𝐡𝐚𝐧
📡 𝗖𝗼𝗺𝗺𝗮𝗻𝗱𝘀 𝗟𝗶𝘀𝘁 (10/𝗣𝗮𝗴𝗲):
`,
    "helpFooter": `
╭───『 📍 𝗣𝗮𝗴𝗲 %1/%2 』───╮
│
│ ✦ 𝗧𝘆𝗽𝗲: ${prefix}help [cmd]
│ ✦ 𝗧𝗼𝘁𝗮𝗹 𝗖𝗺𝗱𝘀: ${commands.size}
│
╰────────────────╯

╭───『 ✨ 𝗢𝗪𝗡𝗘𝗥 𝗠𝗘𝗦𝗦𝗔𝗚𝗘 』───╮
│
│ ❝ 𝐓𝐇𝐈𝐒 𝐁𝐎𝐓 𝐈𝐒 𝐌𝐀𝐃𝐄 𝐒𝐏𝐄𝐂𝐈𝐀𝐋𝐋𝐘
│ 𝐅𝐎𝐑 𝐌𝐘 𝐎𝐖𝐍𝐄𝐑 𝐓𝐀𝐋𝐇𝐀 𝐏𝐀𝐓𝐇𝐀𝐍! ❞
│
│ 🌟 𝐔𝐒𝐄 𝐈𝐓 𝐓𝐎 𝐌𝐀𝐊𝐄 𝐏𝐄𝐎𝐏𝐋𝐄 𝐒𝐌𝐈𝐋𝐄
│ 🎉 𝐒𝐓𝐀𝐘 𝐇𝐀𝐏𝐏𝐘 & 𝐄𝐍𝐉𝐎𝐘!
│
╰───『 © 𝐓𝐚𝐥𝐡𝐚 𝐏𝐚𝐭𝐡𝐚𝐧 』───╯
`
  }
};

module.exports.run = async function({ api, event, args, getText }) {
  const { commands } = global.client;
  const fs = require('fs-extra');
  const axios = require('axios');
  const prefix = global.config.PREFIX;

  // Command-specific help
  if (args[0]) {
    const cmd = commands.get(args[0].toLowerCase());
    if (cmd) {
      const info = getText("moduleInfo", 
        cmd.config.name,
        cmd.config.description,
        `${prefix}${cmd.config.name} ${cmd.config.usages || ""}`,
        cmd.config.commandCategory,
        cmd.config.cooldowns,
        cmd.config.hasPermssion == 0 ? "👤 User" : 
          (cmd.config.hasPermssion == 1 ? "👑 Admin" : "🤖 Bot Owner"),
        cmd.config.credits
      );
      return api.sendMessage(info, event.threadID);
    }
  }

  // Main help menu (10 commands/page)
  const page = parseInt(args[0]) || 1;
  const perPage = 10; // Changed from 2 to 10
  const totalPages = Math.ceil(commands.size / perPage);

  const startIdx = (page - 1) * perPage;
  const cmdList = Array.from(commands.keys())
    .slice(startIdx, startIdx + perPage)
    .map((cmd, i) => `▣ ${startIdx + i + 1}. ${prefix}${cmd}`)
    .join('\n');

  const body = getText("helpHeader") + 
    cmdList + 
    getText("helpFooter", page, totalPages);

  // Background images
  const bgImages = [
    "https://imgur.com/bVfAEoj.jpg",
    "https://imgur.com/bVfAEoj.jpg",
    "https://imgur.com/bVfAEoj.jpg"
  ];
  const randomBG = bgImages[Math.floor(Math.random() * bgImages.length)];

  try {
    const path = __dirname + '/cache/helpv2.jpg';
    const { data } = await axios.get(randomBG, { responseType: 'arraybuffer' });
    fs.writeFileSync(path, Buffer.from(data, 'binary'));
    
    await api.sendMessage({
      body: body,
      attachment: fs.createReadStream(path)
    }, event.threadID);
    
    fs.unlinkSync(path);
  } catch (e) {
    console.error(e);
    await api.sendMessage(body, event.threadID);
  }
};
