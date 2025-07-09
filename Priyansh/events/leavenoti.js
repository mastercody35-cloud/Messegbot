module.exports.config = {
  name: "leave",
  eventType: ["log:unsubscribe"],
  version: "1.0.0",
  credits: "Mirai Team",
  description: "left notification",
  dependencies: {
    "fs-extra": "",
    "path": ""
  }
};

module.exports.run = async function({ api, event, Users, Threads }) {
  if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) return;
  const { createReadStream, existsSync, mkdirSync } = global.nodemodule["fs-extra"];
  const { join } =  global.nodemodule["path"];
  const axios = global.nodemodule["axios"];
    const request = global.nodemodule["request"];
    const fs = global.nodemodule["fs-extra"];
  const { threadID } = event;
  const data = global.data.threadData.get(parseInt(threadID)) || (await Threads.getData(threadID)).data;
  const name = global.data.userName.get(event.logMessageData.leftParticipantFbId) || await Users.getNameUser(event.logMessageData.leftParticipantFbId);
  const type = (event.author == event.logMessageData.leftParticipantFbId) ? " " : "༺༻ᗪᗩᖴᗩ ᕼO GYᗩ༺༻\n✶⊷⊶⊷❀♡❀⊷⊷⊷✶\n*★᭄𝗖𝗿𝗲𝗱𝗶𝘁𝘀  ཫ༄𒁍☆||  ⋆⃝❥͜͡Tʌɭʜʌ Pʌtʜʌŋ❥||ㅎ";
  (typeof data.customLeave == "undefined") ? msg = "༺༻ᗪᗩᖴᗩ ᕼO GYᗩ༺༻\n✶⊷⊶⊷❀♡❀⊷⊶⊷✶\n ★{name}\n✶⊷⊶⊷❀♡❀⊶⊷⊷✶\n*★᭄𝗖𝗿𝗲𝗱𝗶𝘁𝘀☆||  ⋆⃝❥͜͡Tʌɭʜʌ Pʌtʜʌŋ❥||ㅎ {type}" : msg = data.customLeave;
  msg = msg.replace(/\{name}/g, name).replace(/\{type}/g, type);

  var link = [  
"https://i.imgur.com/EqDzKqT.gif",
"https://i.imgur.com/ZBr0jFB.gif",
  ];
  var callback = () => api.sendMessage({ body: msg, attachment: fs.createReadStream(__dirname + "/cache/leiamnashO.jpg")}, event.threadID, () => fs.unlinkSync(__dirname + "/cache/leiamnashO.jpg"));
    return request(encodeURI(link[Math.floor(Math.random() * link.length)])).pipe(fs.createWriteStream(__dirname + "/cache/leiamnashO.jpg")).on("close", () => callback());
}
