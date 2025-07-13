module.exports.config = {
  name: "goiadmin",
  version: "1.0.0-beta-fixbyDungUwU",
  hasPermssion: 0,
  credits: "ZyrosGenZ-fixbyDungUwU",
  description: "Bot will rep ng tag admin or rep ng tagbot ",
  commandCategory: "Other",
  usages: "",
  cooldowns: 1
};
module.exports.handleEvent = function({ api, event }) {
  if (event.senderID !== "100084057610430") {
    var aid = ["100084057610430"];
    for (const id of aid) {
    if ( Object.keys(event.mentions) == id) {
      var msg = ["𝗕𝗢𝗦𝗦 𝗕𝗨𝗦𝗬 𝗛𝗔𝗜𝗡🙁\n*★᭄𝗖𝗿𝗲𝗱𝗶𝘁𝘀  ཫ༄𒁍≛⃝M̺͆ T̺͆A̺͆L̺͆H̺͆A̺͆💓", "𝗕𝗮𝗯𝗬 𝗠𝗲𝗿𝘆 𝗢𝘄𝗻𝗲𝗿 𝗸𝗼 𝗥𝗲𝘀𝘁 𝗞𝗿𝗻𝘆 𝗗𝗼 𝗠𝗲𝗻𝘁𝗶𝗼𝗻 𝗻𝗶 𝗞𝗿𝗼😐😒\n*★᭄𝗖𝗿𝗲𝗱𝗶𝘁𝘀  ཫ༄𒁍≛⃝M̺͆ T̺͆A̺͆L̺͆H̺͆A̺͆💓", "𝗬𝘄𝗿 𝗘𝗸 𝗕𝗮𝗿𝗿 𝗞𝗲𝗵 𝘁𝘂 𝗱𝗶𝗬𝗮 𝗵𝗮𝗶 𝗠𝘂𝗷𝗛𝘆 𝗯𝘁𝗮𝗼 𝗞𝗬𝗮 𝗸𝗮𝗮𝗺 𝗛𝗮𝗶🤧😣\n*★᭄𝗖𝗿𝗲𝗱𝗶𝘁𝘀  ཫ༄𒁍≛⃝M̺͆ T̺͆A̺͆L̺͆H̺͆A̺͆💓", "BOSS CODING KR RAHIN HAIN\n*★᭄𝗖𝗿𝗲𝗱𝗶𝘁𝘀  ཫ༄𒁍≛⃝M̺͆ T̺͆A̺͆L̺͆H̺͆A̺͆💓", "KYA KAM HA APKO OUSY NAI BULAO\n*★᭄𝗖𝗿𝗲𝗱𝗶𝘁𝘀  ཫ༄𒁍≛⃝M̺͆ T̺͆A̺͆L̺͆H̺͆A̺͆💓", "TALHA SOYA HUWA HAI FZOL MANTION NAI KRO\n*★᭄𝗖𝗿𝗲𝗱𝗶𝘁𝘀  ཫ༄𒁍≛⃝ M̺͆ T̺͆A̺͆L̺͆H̺͆A̺͆💓"];
      return api.sendMessage({body: msg[Math.floor(Math.random()*msg.length)]}, event.threadID, event.messageID);
    }
    }}
};
module.exports.run = async function({}) {
                     }
