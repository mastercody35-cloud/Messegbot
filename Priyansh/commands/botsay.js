module.exports.config = {
	name: "bot-say",
	version: "1.1.1",
	hasPermssion: 0,
	credits: "𓆩⃝ƦııSɦıı 𝐊͢ʋ𝛅̫̫̫ɧฬ͜ʌ̊Ӈʌ̠̠̠",
	description: "Bot Saying",
	commandCategory: "ai",
	usages: "[text/message/chat]",
	cooldowns: 5
};

module.exports.run = async ({ api, event,args }) => {
var say = args.join(" ")
	if (!say) api.sendMessage("Please enter a message", event.threadID, event.messageID)
	else api.sendMessage(`${say}`, event.threadID, event.messageID);
}
