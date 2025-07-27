module.exports.config = {
  name: "prefix",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭 | Modified by Talha",
  description: "Show bot prefix in stylish format",
  commandCategory: "Admin",
  usages: "prefix",
  cooldowns: 5,
};

module.exports.handleEvent = async ({ event, api, Threads }) => {
  var { threadID, messageID, body, senderID } = event;
  if ((this.config.credits) != "Modified by Talha") {
    return api.sendMessage(`⚠️ Credit Tampering Detected!`, threadID, messageID);
  }

  function out(data) {
    api.sendMessage(data, threadID, messageID);
  }

  var dataThread = (await Threads.getData(threadID));
  var data = dataThread.data;
  const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
  const prefix = threadSetting.PREFIX || global.config.PREFIX;

  var triggers = [
    "prefix", "mpre", "mprefix", "dấu lệnh", "prefix của bot là gì",
    "daulenh", "duong", "what prefix", "freefix", "what is the prefix",
    "bot dead", "bots dead", "where prefix", "what is bot",
    "what prefix bot", "how to use bot", "how use bot", "where are the bots",
    "bot not working", "bot is offline", "prefx", "prfix", "prifx", "perfix",
    "bot not talking", "where is bot"
  ];

  triggers.forEach(trigger => {
    let formatted = trigger[0].toUpperCase() + trigger.slice(1);
    if (body === trigger || body === trigger.toUpperCase() || body === formatted) {
      const msg =
        `✨ 𝗠𝖞 𝗣𝗋𝖾𝖿𝗂𝗑 𝗂𝗌:\n\n➤ 『 ${prefix} 』\n\n` +
        `🌐 Use this prefix before any command!\n` +
        `📖 Example: ${prefix}help\n\n` +
        `👑 𝗢𝖜𝗇𝖾𝗋: 𝐓𝐚𝐥𝐡𝐚 𝐏𝐚𝐭𝐡𝐚\n` +
        `🔗 𝗙𝖇: https://www.facebook.com/share/193GypVyJQ/\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `💖 𝗧𝗵𝗮𝗻𝗸 𝘆𝗼𝘂 𝗳𝗼𝗿 𝘂𝘀𝗶𝗻𝗴 𝗠𝗢𝗧𝗢 𝗕𝗢𝗧`;

      return out(msg);
    }
  });
};

module.exports.run = async ({ event, api }) => {
  return api.sendMessage("💤 Use this command by typing one of the trigger words.", event.threadID);
};
