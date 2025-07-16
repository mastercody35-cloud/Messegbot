module.exports.config = {
  name: "pairv2",
  version: "1.0.1", 
  hasPermssion: 0,
  credits: "Anup Kumar + Fix by ChatGPT",
  description: "Love pairing",
  commandCategory: "Love", 
  usages: "*pairv2", 
  cooldowns: 0
};

module.exports.run = async function({ api, event, Threads, Users }) {
  const axios = global.nodemodule["axios"];
  const fs = global.nodemodule["fs-extra"];

  try {
    const threadData = await Threads.getData(event.threadID);
    if (!threadData || !threadData.threadInfo || !threadData.threadInfo.participantIDs) {
      return api.sendMessage("❌ Participants ki list nahi mili.", event.threadID);
    }

    const participantIDs = threadData.threadInfo.participantIDs;
    const botID = api.getCurrentUserID();
    const senderID = event.senderID;
    const namee = (await Users.getData(senderID)).name;

    const listUserID = participantIDs.filter(ID => ID != botID && ID != senderID);
    if (listUserID.length === 0) return api.sendMessage("👤 Pair banane ke liye koi aur member nahi mila.", event.threadID);

    let id = listUserID[Math.floor(Math.random() * listUserID.length)];
    let tle = Math.floor(Math.random() * 101);

    // 🔒 Forced pairing rules
    if (senderID == 100052886831202) id = 100042292561861;
    if (senderID == 100042292561861) id = 100052886831202;
    if (senderID == 100063142031840) {
      id = 100080347467595;
      tle = 1000;
    }

    const userData = await Users.getData(id);
    if (!userData || !userData.name) {
      return api.sendMessage("❌ User ka data load nahi ho saka.", event.threadID);
    }

    const name = userData.name;

    const arraytag = [
      { id: senderID, tag: namee },
      { id: id, tag: name }
    ];

    // 🖼️ Download avatar and gif safely
    let AvatarBuffer, gifLoveBuffer;
    try {
      const Avatar = await axios.get(`https://graph.facebook.com/${senderID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" });
      AvatarBuffer = Buffer.from(Avatar.data, "utf-8");
      fs.writeFileSync(__dirname + "/cache/avt.png", AvatarBuffer);

      const gifLove = await axios.get(`https://i.ibb.co/HHPnMVz/6b0cc1c6326d1099495b6795817d6517.gif`, { responseType: "arraybuffer" });
      gifLoveBuffer = Buffer.from(gifLove.data, "utf-8");
      fs.writeFileSync(__dirname + "/cache/giflove.png", gifLoveBuffer);
    } catch (err) {
      console.error("Image download error:", err.message);
      return api.sendMessage("❌ Avatar ya GIF load nahi ho saka.", event.threadID);
    }

    const message = {
      body: `💞 ${namee} ❤️ ${name}\n🌹 Love Match: ${tle}%`,
      mentions: arraytag,
      attachment: fs.createReadStream(__dirname + "/cache/giflove.png")
    };

    return api.sendMessage(message, event.threadID, () => {
      fs.unlinkSync(__dirname + "/cache/giflove.png");
      fs.unlinkSync(__dirname + "/cache/avt.png");
    });

  } catch (error) {
    console.error("Pairv2 error:", error.message);
    return api.sendMessage("❌ Internal error: pairing nahi ho saka 😓", event.threadID);
  }
};
