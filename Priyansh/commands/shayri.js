const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.config = {
  name: "shayri",
  version: "3.0",
  hasPermssion: 0,
  credits: "Talha",
  description: "Get sad Urdu shayris with user profile picture",
  commandCategory: "entertainment",
  usages: "[keyword]",
  cooldowns: 5
};

// 100+ Sad Urdu Shayris Database
const SHAYRI_DB = [
  "دکھ تو یہ ہے کہ تمہارے بعد بھی\nزندگی نے چلنا سکھا دیا",
  "تمہاری یادوں کا سفر جاری ہے\nہر قدم پر درد کا پہاڑ ملتا ہے",
  // Add 98+ more shayris...
  "وہ شخص بھی عجیب تھا\nجو چھوڑ گیا اور یہ کہہ گیا کہ تمہیں خوش رہنا ہے"
];

module.exports.run = async function({ api, event, args }) {
  try {
    // Get random shayri
    const shayriText = SHAYRI_DB[Math.floor(Math.random() * SHAYRI_DB.length)];

    // Get sender's profile picture
    const senderID = event.senderID;
    const imgURL = `https://graph.facebook.com/${senderID}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
    const imgPath = path.join(__dirname, 'cache', `shayri_${senderID}.jpg`);

    // Download profile picture
    const response = await axios({ 
      method: 'GET',
      url: imgURL,
      responseType: 'stream'
    });

    const writer = fs.createWriteStream(imgPath);
    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    // Stylish message format
    const formattedMsg = 
      `╔═══════•⊰✿⊱•═══════╗\n` +
      `  ✨ ${shayriText} ✨\n` +
      `╚═══════•⊰✿⊱•═══════╝\n\n` +
      `📌 Requested by: ${event.senderName}\n` +
      `👑 Owner: 𝕿𝖆𝖑𝖍𝖆 𝕻𝖆𝖙𝖍𝖆𝖓`;

    // Send message with attachment
    api.sendMessage({
      body: formattedMsg,
      attachment: fs.createReadStream(imgPath)
    }, event.threadID, () => fs.unlinkSync(imgPath), event.messageID);

  } catch (error) {
    console.error("Error:", error);
    // Fallback text response
    const fallbackShayri = SHAYRI_DB[Math.floor(Math.random() * SHAYRI_DB.length)];
    api.sendMessage(
      `╔═══════•⊰✿⊱•═══════╗\n` +
      `  ✨ ${fallbackShayri} ✨\n` +
      `╚═══════•⊰✿⊱•═══════╝\n\n` +
      `📌 Error loading image\n` +
      `👑 𝐎𝐰𝐧𝐞𝐫: 𝐓𝐀𝐋𝐇𝐀 𝐏𝐀𝐓𝐇𝐀𝐍`,
      event.threadID,
      event.messageID
    );
  }
};
