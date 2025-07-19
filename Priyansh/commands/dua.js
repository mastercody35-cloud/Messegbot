const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.config = {
  name: "dua",
  version: "1.0",
  hasPermssion: 0,
  credits: "Talha",
  description: "Islamic duas with video recitation",
  commandCategory: "islamic",
  usages: "[topic]",
  cooldowns: 5
};

// 100+ Authentic Islamic Duas Database
const DUA_DB = [
  {
    text: "رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي",
    translation: "O my Lord! Expand my chest for me and make my task easy for me",
    reference: "Quran 20:25-28",
    video: "https://example.com/dua1.mp4" // Replace with actual video URLs
  },
  {
    text: "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا وَرِزْقًا طَيِّبًا وَعَمَلًا مُتَقَبَّلًا",
    translation: "O Allah! I ask You for beneficial knowledge, good provision and acceptable deeds",
    reference: "Ibn Majah",
    video: "https://example.com/dua2.mp4"
  },
  // Add 98+ more duas...
];

module.exports.run = async function({ api, event, args }) {
  try {
    // Get random dua
    const randomDua = DUA_DB[Math.floor(Math.random() * DUA_DB.length)];

    // Download video
    const videoPath = path.join(__dirname, 'cache', 'dua_video.mp4');
    const response = await axios({
      method: 'GET',
      url: randomDua.video,
      responseType: 'stream'
    });

    const writer = fs.createWriteStream(videoPath);
    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    // Stylish message format
    const formattedMsg = 
      `╭───────────────╮\n` +
      `  📿 *Dua of the Day* 📿\n` +
      `╰───────────────╯\n\n` +
      `📜 Arabic: ${randomDua.text}\n\n` +
      `🌍 Translation: ${randomDua.translation}\n\n` +
      `📖 Reference: ${randomDua.reference}\n\n` +
      `👳 Owner: Ṭαℓнα Pαтнαη`;

    // Send message with video
    api.sendMessage({
      body: formattedMsg,
      attachment: fs.createReadStream(videoPath)
    }, event.threadID, () => fs.unlinkSync(videoPath), event.messageID);

  } catch (error) {
    console.error("Dua Error:", error);
    
    // Fallback text response
    const fallbackDua = DUA_DB[Math.floor(Math.random() * DUA_DB.length)];
    api.sendMessage(
      `📿 *Dua*\n\n${fallbackDua.text}\n\n` +
      `Translation: ${fallbackDua.translation}\n\n` +
      `Owner: Talha Pathan`,
      event.threadID,
      event.messageID
    );
  }
};
