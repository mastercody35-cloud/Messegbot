module.exports.config = { 
  name: "punch",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "Talha",
  description: "Punch someone with anime GIFs",
  commandCategory: "fun",
  usages: "punch [tag someone]",
  cooldowns: 5,
  dependencies: {
    "axios": "",
    "fs-extra": ""
  }
};

module.exports.run = async function({ api, event, args }) {
  const axios = require('axios');
  const fs = require("fs-extra");
  
  // List of anime punch GIFs
  const punchGifs = [
    "https://i.gifer.com/8Ot9.gif",
    "https://i.gifer.com/1Zwp.gif",
    "https://i.gifer.com/3QAZ.gif",
    "https://i.gifer.com/3QBa.gif",
    "https://i.gifer.com/YSqK.gif",
    "https://i.gifer.com/YSqQ.gif",
    "https://i.gifer.com/XOsX.gif",
    "https://i.gifer.com/3Q9D.gif",
    "https://i.gifer.com/YSqY.gif",
    "https://i.gifer.com/YSqZ.gif"
  ];
  
  // Randomly select a GIF
  const gifUrl = punchGifs[Math.floor(Math.random() * punchGifs.length)];
  
  try {
    if (!args[0]) {
      return api.sendMessage("Please tag someone to punch!", event.threadID, event.messageID);
    }
    
    const mention = Object.keys(event.mentions)[0];
    if (!mention) {
      return api.sendMessage("You need to tag someone!", event.threadID, event.messageID);
    }
    
    const name = event.mentions[mention];
    const tag = name.replace("@", "");
    
    // Download the GIF
    const response = await axios.get(gifUrl, { responseType: "arraybuffer" });
    fs.writeFileSync(__dirname + "/cache/punch.gif", Buffer.from(response.data, "binary"));
    
    // Send the message with GIF
    api.sendMessage({
      body: `Ora ora ora! ${tag} got punched! 👊`,
      mentions: [{
        tag: tag,
        id: mention
      }],
      attachment: fs.createReadStream(__dirname + "/cache/punch.gif")
    }, event.threadID, () => {
      // Delete the cached file after sending
      fs.unlinkSync(__dirname + "/cache/punch.gif");
    }, event.messageID);
    
    // Add reaction
    api.setMessageReaction("✅", event.messageID, (err) => {}, true);
    
  } catch (error) {
    console.error(error);
    api.sendMessage("Failed to send punch GIF. Please try again later!", event.threadID, event.messageID);
    api.setMessageReaction("☹️", event.messageID, (err) => {}, true);
  }
};
