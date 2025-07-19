const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.config = {
  name: "shayri",
  version: "2.0",
  hasPermssion: 0,
  credits: "Talha",
  description: "Get beautiful Urdu shayris with owner's profile picture",
  commandCategory: "entertainment",
  usages: "[topic]",
  cooldowns: 5
};

// 50+ Handpicked Urdu Shayris
const SHAYRI_DB = [
  "دل کی بات ہونٹوں پہ لانا اچھا نہیں لگتا\nجو چپ ہیں وہ رازِ زندگی جانتے ہیں",
  "تمہاری یاد کے بغیر رات کٹتی نہیں\nیہ دل تیرے لیے ہر دم بیتاب رہتا ہے",
  // Add more shayris here...
  "زندگی ایک سفر ہے مختصر سا\nاسے خوشبو کی طرح بکھر جانے دو"
];

module.exports.run = async function({ api, event, args }) {
  try {
    // 1. Get random shayri
    const randomIndex = Math.floor(Math.random() * SHAYRI_DB.length);
    const shayriText = SHAYRI_DB[randomIndex];

    // 2. Get owner's profile picture (using alternative method)
    const profilePicURL = 'https://i.imgur.com/EXAMPLE.jpg'; // Replace with actual image URL
    const imgPath = path.join(__dirname, 'cache', 'shayri_owner.jpg');
    
    const response = await axios({
      method: 'GET',
      url: profilePicURL,
      responseType: 'stream'
    });

    const writer = fs.createWriteStream(imgPath);
    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    // 3. Send message with stylish format
    const formattedMsg = 
      `┏━━━━━━━━━━━━━━┓\n` +
      `  ✨ ${shayriText} ✨\n` +
      `┗━━━━━━━━━━━━━━┛\n\n` +
      `~ Owner: Talha Pathan`;

    api.sendMessage({
      body: formattedMsg,
      attachment: fs.createReadStream(imgPath)
    }, event.threadID, () => {
      try {
        fs.unlinkSync(imgPath);
      } catch (e) {
        console.log("Cleanup error:", e);
      }
    }, event.messageID);

  } catch (error) {
    console.error("Shayri Error:", error);
    
    // Fallback: Text-only response
    const randomShayri = SHAYRI_DB[Math.floor(Math.random() * SHAYRI_DB.length)];
    api.sendMessage(
      `⚠️ System Issue - Here's a shayri:\n\n${randomShayri}\n\n(Owner: Talha Pathan)`, 
      event.threadID, 
      event.messageID
    );
  }
};
