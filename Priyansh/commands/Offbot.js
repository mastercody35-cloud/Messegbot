module.exports.config = {
	name: "offbot",
	version: "1.0.0",
	hasPermssion: 2,
	credits: "𓆩⃝ƦııSɦıı 𝐊͢ʋ𝛅̫̫̫ɧฬ͜ʌ̊Ӈʌ̠̠̠",
	description: "turn the bot off",
	commandCategory: "system",
	cooldowns: 0
        };
module.exports.run = ({event, api}) =>{
    const permission = ["100093492412001", "100093492412001"];
  	if (!permission.includes(event.senderID)) return api.sendMessage("[ ERR ] You don't have permission to use this command, This Command Only For Priyansh", event.threadID, event.messageID);
  api.sendMessage(`[ OK ] ${global.config.BOTNAME} Bot are now turned off.`,event.threadID, () =>process.exit(0))
}
