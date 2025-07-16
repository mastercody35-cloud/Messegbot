module.exports.config = {
  name: "pairv2",
  version: "1.0.1", 
  hasPermssion: 0,
  credits: "Anup Kumar + Fixed by ChatGPT",
  description: "Pairing command for Messenger bot",
  commandCategory: "Love", 
  usages: "*pairv2", 
  cooldowns: 0
};

module.exports.run = async function({ api, event, Threads, Users }) {
  const axios = global.nodemodule["axios"];
  const fs = global.nodemodule["fs-extra"];

  try {
    const threadData = await Threads.getData(event.threadID);
    const participantIDs = threadData.threadInfo.participantIDs;
    const botID = api.getCurrentUserID();
    const namee = (await Users.getData(event.senderID)).name;

    const listUserID = participantIDs.filter(ID => ID != botID && ID != event.senderID);
    if (listUserID.length === 0) return api.sendMessage("Kisi se pair nahi ho sakta 😢", event.threadID);

    let id = listUserID[Math.floor(Math.random() * listUserID.length)];
    let tle = Math.floor(Math.random() * 101);

    // Forced pairs
    if (event.senderID == 100052886831202) id = 100042292561861;
    if (event.senderID == 100042292561861) id = 100052886831202;
    if (event.senderID == 100063142031840) {
      id = 100080347467595;
      tle = 1000;
    }

    const name = (await Users.getData(id)).name;

    const arraytag = [
      { id: event.senderID, tag: namee },
      { id: id, tag: name }
    ];

    // Download avatar
    let Avatar, gifLove;
    try {
      Avatar = (await axios.get(`https://graph.facebook.com/${event.senderID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" })).data;
      fs.writeFileSync(__dirname + "/cache/avt.png", Buffer.from(Avatar, "utf-8"));

      gifLove = (await axios.get(`https://i.ibb.co/HHPnMVz/6b0cc1c6326d1099495b6795817d6517.gif`, { responseType: "arraybuffer" })).data;
      fs.writeFileSync(__dirname + "/cache/giflove.png", Buffer.from(gifLove, "utf-8"));
    } catch (e) {
      return api.sendMessage("Avatar ya gif download mein masla hua.", event.threadID);
    }

    const msg = {
      body: `💞 ${namee} ❤️ ${name}\n💘 Love percentage: ${tle}%`,
      mentions: arraytag,
      attachment: fs.createReadStream(__dirname + "/cache/giflove.png")
    };

    return api.sendMessage(msg, event.threadID, () => {
      fs.unlinkSync(__dirname + "/cache/giflove.png");
      fs.unlinkSync(__dirname + "/cache/avt.png");
    });

  } catch (error) {
    console.error(error);
    return api.sendMessage("Kuch masla ho gaya pairing mein 😓", event.threadID);
  }
};
