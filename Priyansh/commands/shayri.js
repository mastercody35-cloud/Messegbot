const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.config = {
  name: "shayri",
  version: "1.0",
  hasPermssion: 0,
  credits: "Talha",
  description: "Get random Urdu shayri with creator's profile picture",
  commandCategory: "fun",
  usages: "[topic]",
  cooldowns: 5
};

// Database of 50+ Shayris
const SHAYRI_DB = [
  "دل کی بات ہونٹوں پہ لانا اچھا نہیں لگتا\nجو چپ ہیں وہ رازِ زندگی جانتے ہیں",
  "تمہاری یاد کے بغیر رات کٹتی نہیں\nیہ دل تیرے لیے ہر دم بیتاب رہتا ہے",
  // Add 48+ more shayris here...
  "زندگی ایک سفر ہے مختصر سا\nاسے خوشبو کی طرح بکھر جانے دو"
];

module.exports.run = async function({ api, event, args }) {
  try {
    // Get random shayri
    const randomShayri = SHAYRI_DB[Math.floor(Math.random() * SHAYRI_DB.length)];

    // Get Talha's profile picture
    const profilePic = await axios.get('https://graph.facebook.com/1000123456789/picture?width=720&height=720&access_token=YOUR_ACCESS_TOKEN', {
      responseType: 'stream'
    });

    const shayriPath = path.join(__dirname, 'cache', 'shayri.jpg');
    const writer = fs.createWriteStream(shayriPath);
    profilePic.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    // Stylish message format
    const message = {
      body: `╔═════≪ •❈• ≫═════╗\n       ✨ ${randomShayri} ✨\n╚═════≪ •❈• ≫═════╗\n\n👤 𝐎𝐖𝐍𝐄𝐑: 𝐓𝐚𝐥𝐇𝐚 𝐏𝐚𝐭𝐇𝐚𝐧`,
      attachment: fs.createReadStream(shayriPath)
    };

    api.sendMessage(message, event.threadID, () => fs.unlinkSync(shayriPath), event.messageID);

  } catch (error) {
    console.error(error);
    api.sendMessage("❌ Error fetching shayri. Try again later.", event.threadID);
  }
};
