module.exports.config = {
	name: "inf",
	version: "1.0.1", 
	hasPermssion: 0,
	credits: "Siizz", //don't change the credits please
	description: "Admin and Bot info.",
	commandCategory: "...",
	cooldowns: 1,
	dependencies: 
	{
    "request":"",
    "fs-extra":"",
    "axios":""
  }
};
module.exports.run = async function({ api,event,args,client,Users,Threads,__GLOBAL,Currencies }) {
const axios = global.nodemodule["axios"];
const request = global.nodemodule["request"];
const fs = global.nodemodule["fs-extra"];
const time = process.uptime(),
		hours = Math.floor(time / (60 * 60)),
		minutes = Math.floor((time % (60 * 60)) / 60),
		seconds = Math.floor(time % 60);
const moment = require("moment-timezone");
var juswa = moment.tz("Asia/Lahore").format("『D/MM/YYYY』 【HH:mm:ss】");
var link =                                     
["https://i.imgur.com/oQWy3Ax.jpg"];
var callback = () => api.sendMessage({body:` ╔╬⓼★⓼╃────𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐓𝐈𝐎𝐍─𝄠━─Ⓔ⧐ ╰✾✾╀✿✿╀─━ↈⓇ⧐

☄️•| 𝙱𝙾𝚃 𝙽𝙰𝙼𝙴 |•☄️  ${global.config.BOTNAME}

🥀𝐑𝐞𝐥𝐚𝐭𝐢𝐨𝐧𝐬𝐡𝐢𝐩 :- 𝐒𝐢𝐧𝐠𝐋𝐞

🙈𝗕𝗢𝗧 𝗢𝗪𝗡𝗘𝗥 𝗙𝗕 𝗜𝗗 𝗟𝗜𝗡𝗞🙈➪ 

https://www.facebook.com/profile.php?id=100084057610430 🌸💯

💋🦋_____________________🔥👑
°
                بََدناَمِ تَو بُہتِِ ہُ٘وں اسِِؔں زَمـاَنِِـے مََی٘ں 
         تُو بَ٘تاََ تَیرِے سُنّنِے مَی٘ں کِِ٘ونَسؔاَ قِ٘ـصََـہ آیاَ ہََـ٘ے
🍒🦋_____________________💋🍷
✧══════•❁❀❁•══════✧

🌸Bot Prefix🌸☞︎︎︎☜︎︎︎✰ ${global.config.PREFIX}

♥️Bot Owner♥️ ★᭄𝗖𝗿𝗲𝗱𝗶𝘁𝘀 ༄𒁍≛⃝𝙏𝙖𝙡𝙃𝙖

🥳UPTIME🥳

🌪️Today is🌪️ ☞︎︎︎☜︎︎︎✰ ${juswa} 

⚡Bot is running⚡ ${hours}:${minutes}:${seconds}.

🦢🍒•••ꞪɛᏒɛ ɪʂ ɮ❍┼ ❍ωɳɜɽ ɳaʍɜ•••🌷
┏━🕊️━━°❀•°:°•❀°━━💞━┓
   🌸✧✰🍒T̺͆A̺͆L̺͆H̺͆A̺͆🌿✰✧🌸
┗━🕊️━━°❀•°:°•❀°━━💞━┛
`,attachment: fs.createReadStream(__dirname + "/cache/juswa.jpg")}, event.threadID, () => fs.unlinkSync(__dirname + "/cache/juswa.jpg")); 
      return request(encodeURI(link[Math.floor(Math.random() * link.length)])).pipe(fs.createWriteStream(__dirname+"/cache/juswa.jpg")).on("close",() => callback());
   };
