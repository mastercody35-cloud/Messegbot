module.exports.config = {
  name: "prefix",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭",
  description: "Shows bot prefix info",
  commandCategory: "Admin",
  usages: "",
  cooldowns: 5,
};

module.exports.handleEvent = async ({ event, api, Threads }) => {
  const { threadID, messageID, body, senderID } = event;

  // Credits check
  if (this.config.credits !== "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭") {
    return api.sendMessage(`Again change credit to 𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭`, threadID, messageID);
  }

  function send(msg) {
    api.sendMessage(msg, threadID, messageID);
  }

  const dataThread = await Threads.getData(threadID);
  const data = dataThread?.data || {};
  const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
  const prefix = threadSetting.PREFIX || global.config.PREFIX;

  const keywords = [
    "mpre", "mprefix", "prefix", "dấu lệnh", "prefix của bot là gì", "daulenh",
    "duong", "what prefix", "freefix", "what is the prefix", "bot dead",
    "bots dead", "where prefix", "what is bot", "what prefix bot", "how to use bot",
    "how use bot", "where are the bots", "bot not working", "bot is offline",
    "prefx", "prfix", "prifx", "perfix", "bot not talking", "where is bot"
  ];

  for (let keyword of keywords) {
    const str = keyword.charAt(0).toUpperCase() + keyword.slice(1);
    if (body === keyword || body === keyword.toUpperCase() || body === str) {
      return send(
` ╔════ ❀.•🎀•.❀ ════╗
         𝐁𝐎𝐓 𝐏𝐑𝐄𝐅𝐈𝐗
 ╚════ ❀.•🎀•.❀ ════╝

🔹 𝗣𝗥𝗘𝗙𝗜𝗫: [ ${prefix} ]
🔹 𝗢𝗪𝗡𝗘𝗥: 𝑻𝒂𝒍𝒉𝒂 𝑷𝒂𝒕𝒉𝒂𝒏
🔹 𝗢𝗙𝗙𝗜𝗖𝗜𝗔𝗟 𝗙𝗕: https://www.facebook.com/share/193GypVyJQ/

💙 𝑻𝒉𝒂𝒏𝒌 𝒚𝒐𝒖 𝒇𝒐𝒓 𝒖𝒔𝒊𝒏𝒈 𝒎𝒚 𝒃𝒐𝒕!
🕊️ 𝑺𝒕𝒂𝒚 𝒄𝒐𝒐𝒍 𝒂𝒏𝒅 𝒔𝒑𝒓𝒆𝒂𝒅 𝒍𝒐𝒗𝒆 💫`
      );
    }
  }
};

module.exports.run = async ({ event, api, Threads }) => {
  const threadID = event.threadID;
  const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
  const prefix = threadSetting.PREFIX || global.config.PREFIX;

  return api.sendMessage(
` ╔════ ❀.•🎀•.❀ ════╗
         𝐁𝐎𝐓 𝐏𝐑𝐄𝐅𝐈𝐗
 ╚════ ❀.•🎀•.❀ ════╝

🔹 𝗣𝗥𝗘𝗙𝗜𝗫: [ ${prefix} ]
🔹 𝗢𝗪𝗡𝗘𝗥: 𝑻𝒂𝒍𝒉𝒂 𝑷𝒂𝒕𝒉𝒂𝒏
🔹 𝗢𝗙𝗙𝗜𝗖𝗜𝗔𝗟 𝗙𝗕: https://www.facebook.com/share/193GypVyJQ/

💙 𝑻𝒉𝒂𝒏𝒌 𝒚𝒐𝒖 𝒇𝒐𝒓 𝒖𝒔𝒊𝒏𝒈 𝒎𝒚 𝒃𝒐𝒕!
🕊️ 𝑺𝒕𝒂𝒚 𝒄𝒐𝒐𝒍 𝒂𝒏𝒅 𝒔𝒑𝒓𝒆𝒂𝒅 𝒍𝒐𝒗𝒆 💫`, threadID
  );
};
