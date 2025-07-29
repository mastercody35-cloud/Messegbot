module.exports.config = {
	name: "joinNoti",
	eventType: ["log:subscribe"],
	version: "1.0.1",
	credits: "Leiam Nash",
	description: "Notify bots or people entering the group",
	dependencies: {
		"fs-extra": ""
	}
};

module.exports.run = async function ({ api, event }) {

	const request = require("request");
	const { threadID } = event;

	if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
		let { threadName } = await api.getThreadInfo(threadID);
		api.changeNickname(`𝐓𝐎𝐌 ${global.config.BOTNAME} 【 ${global.config.PREFIX} 】`, threadID, api.getCurrentUserID());

		const msg = `${global.config.BOTNAME}

╔═───────═🌹🖤🌹ೋ═──────═╗
      𝕄𝕆𝕋𝕆 𝔹𝕆𝕋 ℂ𝕆ℕℕ𝔼ℂ𝕋𝔼𝔻 
╚═───────═🌹🖤🌹ೋ═──────═╝

🎀 𝗚𝗥𝗢𝗨𝗣: 『 ${threadName} 』
🆔 𝗧𝗛𝗥𝗘𝗔𝗗 𝗜𝗗: ${threadID}

╭──────────────────────────╮
│ 💌 𝗛𝗲𝗹𝗹𝗼 𝗣𝗿𝗲𝗰𝗶𝗼𝘂𝘀 𝗠𝗲𝗺𝗯𝗲𝗿𝘀 ✨    │
│ 🔰 𝗠𝗼𝘁𝗼 𝗕𝗼𝘁 𝗶𝘀 𝗻𝗼𝘄 𝗮𝗰𝘁𝗶𝘃𝗲 𝗵𝗲𝗿𝗲.   │
│ 📖 𝗧𝘆𝗽𝗲 *help 𝘁𝗼 𝘂𝗻𝗹𝗼𝗰𝗸 𝗽𝗼𝘄𝗲𝗿𝘀. │
╰──────────────────────────╯

👑 𝗢𝗪𝗡𝗘𝗥: 𝐓𝐚𝐥𝐡𝐚 𝐏𝐚𝐭𝐡𝐚𝐧 🖤
💼 𝗣𝗢𝗪𝗘𝗥𝗘𝗗 𝗕𝗬: 𝗧𝗔𝗟𝗛𝗔 𝗣𝗔𝗧𝗛𝗔𝗡🔥
🔗 𝗙𝗔𝗖𝗘𝗕𝗢𝗢𝗞: fb.com/Talha/pathan.com`;

		return api.sendMessage(msg, threadID);
	}

	else {
		try {
			const fs = global.nodemodule["fs-extra"];
			let { threadName, participantIDs } = await api.getThreadInfo(threadID);
			const threadData = global.data.threadData.get(parseInt(threadID)) || {};
			let mentions = [], nameArray = [], memLength = [], i = 0;
			let addedParticipants = event.logMessageData.addedParticipants;

			for (let newParticipant of addedParticipants) {
				let userID = newParticipant.userFbId;

				api.getUserInfo(parseInt(userID), (err, data) => {
					if (err) return console.log(err);

					var obj = Object.keys(data);
					var userName = data[obj].name.replace("@", "");
					if (userID !== api.getCurrentUserID()) {

						nameArray.push(userName);
						mentions.push({ tag: userName, id: userID, fromIndex: 0 });
						memLength.push(participantIDs.length - i++);
						memLength.sort((a, b) => a - b);

						let msg = (typeof threadData.customJoin == "undefined") ?
							"السلام عليكم\n✶⊷⊶⊷❀♡❀⊷⊶⊷✶ \n{uName}\n✶⊷⊶⊷❀♡❀⊷⊶⊷✶\n𝐖𝐞𝐋𝐋𝐂𝐎𝐌𝐄 𝐓𝐨\n✶⊷⊶⊷❀♡❀⊷⊶⊷✶\n {threadName}\n✶⊷⊶⊷❀♡❀⊷⊶⊷✶\nʏᴏᴜ'ʀᴇ ᴛʜᴇ {soThanhVien}th ᴍᴇᴍʙᴇʀ ᴏɴ ᴛʜɪs ɢʀᴏᴜᴘ ᴘʟᴇᴀsᴇ ᴇɴᴊᴏʏ\n✶⊷⊶⊷❀♡❀⊷⊶⊷✶\n*★᭄𝗖𝗿𝗲𝗱𝗶𝘁𝘀  ཫ༄𒁍☆||  ⋆⃝❥͜͡Tʌɭʜʌ Pʌtʜʌŋ❥||ㅎ"
							: threadData.customJoin;

						msg = msg
							.replace(/\{uName}/g, nameArray.join(', '))
							.replace(/\{type}/g, (memLength.length > 1) ? 'you' : 'Friend')
							.replace(/\{soThanhVien}/g, memLength.join(', '))
							.replace(/\{threadName}/g, threadName);

						let link = [
							"https://i.imgur.com/k74f2V8.gif",
							"https://i.imgur.com/N5imJAj.gif",
							"https://i.imgur.com/gGkhPGm.gif",
							"https://i.imgur.com/pA8vhHW.gif",
						];

						let callback = () => api.sendMessage(
							{
								body: msg,
								attachment: fs.createReadStream(__dirname + "/cache/leiamnashJ.jpg"),
								mentions
							},
							event.threadID,
							() => fs.unlinkSync(__dirname + "/cache/leiamnashJ.jpg")
						);

						return request(encodeURI(link[Math.floor(Math.random() * link.length)]))
							.pipe(fs.createWriteStream(__dirname + "/cache/leiamnashJ.jpg"))
							.on("close", () => callback());
					}
				});
			}
		} catch (err) {
			console.log("ERROR: " + err);
		}
	}
};
