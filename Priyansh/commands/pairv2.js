module.exports.config = {
  name: "pairv2",
  version: "1.0.2", 
  hasPermssion: 0,
  credits: "Anup Kumar + Fix by ChatGPT",
  description: "Pairing command for love match",
  commandCategory: "Love", 
  usages: "*pairv2", 
  cooldowns: 0
};

module.exports.run = async function({ api, event, Users }) {
  const axios = global.nodemodule["axios"];
  const fs = global.nodemodule["fs-extra"];

  try {
    // ✅ Load thread participants from API
    const threadInfo = await api.getThreadInfo(event.threadID);
    if (!threadInfo || !threadInfo.participantIDs) {
      return api.sendMessage("❌ Participants ki list nahi mil saki. Bot ko group admin bana do.", event.threadID);
    }

    const participantIDs = threadInfo.participantIDs;
    const botID = api.getCurrentUserID();
    const senderID = event.senderID;

    const listUserID = participantIDs.filter(ID => ID != botID && ID != senderID);
    if (listUserID.length === 0) {
      return api.sendMessage("❌ Pairing ke liye koi aur member nahi mila group mein.", event.threadID);
    }

    // ✅ Get sender name
    const senderName = (await Users.getData(senderID)).name;

    // ✅ Random or forced pair
    let id = listUserID[Math.floor(Math.random() * listUserID.length)];
    let lovePercent = Math.floor(Math.random() * 101);

    if (senderID == 100052886831202) id = 100042292561861;
    if (senderID == 100042292561861) id = 100052886831202;
    if (senderID == 100063142031840) {
      id = 100080347467595;
      lovePercent = 1000;
    }

    const targetData = await Users.getData(id);
    const targetName = targetData.name;

    const arraytag = [
      { id: senderID, tag: senderName },
      { id: id, tag: targetName }
    ];

    // ✅ Download avatar and gif
    let AvatarBuffer, gifBuffer;
    try {
      const avatarRes = await axios.get(`https://graph.facebook.com/${senderID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" });
      AvatarBuffer = Buffer.from(avatarRes.data, "utf-8");
      fs.writeFileSync(__dirname + "/cache/avt.png", AvatarBuffer);

      const gifRes = await axios.get(`https://i.ibb.co/HHPnMVz/6b0cc1c6326d1099495b6795817d6517.gif`, { responseType: "arraybuffer" });
      gifBuffer = Buffer.from(gifRes.data, "utf-8");
      fs.writeFileSync(__dirname + "/cache/giflove.png", gifBuffer);
    } catch (imgErr) {
      console.error("Image Error:", imgErr.message);
      return api.sendMessage("❌ Avatar ya GIF load nahi ho saka. Try again later.", event.threadID);
    }

    // ✅ Send love message
    const msg = {
      body: `💞 ${senderName} ❤️ ${targetName}\n💕 Compatibility: ${lovePercent}%`,
      mentions: arraytag,
      attachment: fs.createReadStream(__dirname + "/cache/giflove.png")
    };

    return api.sendMessage(msg, event.threadID, () => {
      fs.unlinkSync(__dirname + "/cache/avt.png");
      fs.unlinkSync(__dirname + "/cache/giflove.png");
    });

  } catch (err) {
    console.error("pairv2 Error:", err.message);
    return api.sendMessage("❌ Internal error: pairing mein masla aa gaya.", event.threadID);
  }
};
