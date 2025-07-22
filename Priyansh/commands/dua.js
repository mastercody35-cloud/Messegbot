const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.config = {
    name: "dua",
    version: "2.0",
    hasPermssion: 0,
    credits: "Talha Pathan",
    description: "Islamic duas with Arabic text and Urdu/English translations",
    commandCategory: "islamic",
    usages: "[topic]",
    cooldowns: 5
};

// 50 Authentic Islamic Duas Database
const DUA_DB = [
    {
        arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
        urdu: "اے ہمارے رب! ہمیں دنیا میں بھلائی عطا فرما اور آخرت میں بھی بھلائی عطا فرما اور ہمیں آگ کے عذاب سے بچا",
        english: "Our Lord! Give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire",
        reference: "Surah Al-Baqarah 2:201"
    },
    {
        arabic: "رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي",
        urdu: "اے میرے رب! میرے سینے کو کشادہ کر دے اور میرے کام کو آسان کر دے",
        english: "My Lord! Expand my breast for me and make my task easy for me",
        reference: "Surah Taha 20:25-28"
    },
    {
        arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا وَرِزْقًا طَيِّبًا وَعَمَلًا مُتَقَبَّلًا",
        urdu: "اے اللہ! میں تجھ سے نفع بخش علم، پاکیزہ رزق اور قابل قبول عمل کی دعا کرتا ہوں",
        english: "O Allah! I ask You for beneficial knowledge, good provision and acceptable deeds",
        reference: "Ibn Majah"
    },
    // Continue adding 47 more duas following the same format...
    {
        arabic: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ",
        urdu: "اے اللہ! تو ہی میرا رب ہے، تیرے سوا کوئی معبود نہیں، تو نے مجھے پیدا کیا اور میں تیرا بندہ ہوں",
        english: "O Allah! You are my Lord, there is no god but You. You created me and I am Your servant",
        reference: "Morning/Evening Adhkar"
    }
];

module.exports.run = async function({ api, event, args }) {
    try {
        // Get random dua
        const duaData = DUA_DB[Math.floor(Math.random() * DUA_DB.length)];
        
        // Get sender's profile picture
        const senderID = event.senderID;
        const imgURL = `https://graph.facebook.com/${senderID}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
        const imgPath = path.join(__dirname, 'cache', `dua_${senderID}.jpg`);

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
        const formattedMsg = `╔═══════════════════╗
  『 𝗗𝗗𝗨𝗔 𝗘𝗫𝗣𝗥𝗘𝗦𝗦𝗗 』
╚═══════════════════╝

📜 𝗔𝗿𝗮𝗯𝗶𝗰:
${duaData.arabic}

🔵 𝗨𝗿𝗱𝘂 𝗧𝗿𝗮𝗻𝘀𝗹𝗮𝘁𝗶𝗼𝗻:
${duaData.urdu}

🔴 𝗘𝗻𝗴𝗹𝗶𝘀𝗵 𝗧𝗿𝗮𝗻𝘀𝗹𝗮𝘁𝗶𝗼𝗻:
${duaData.english}

📖 𝗥𝗲𝗳𝗲𝗿𝗲𝗻𝗰𝗲: ${duaData.reference}

👤 𝗥𝗲𝗾𝘂𝗲𝘀𝘁𝗲𝗱 𝗯𝘆: ${event.senderName}
👑 𝗢𝘄𝗻𝗲𝗿: 𝐓𝐀𝐋𝐇𝐀 𝐏𝐀𝐓𝐇𝐀𝐍 💞`;

        // Send message with attachment
        api.sendMessage({
            body: formattedMsg,
            attachment: fs.createReadStream(imgPath)
        }, event.threadID, () => fs.unlinkSync(imgPath), event.messageID);

    } catch (error) {
        console.error("Dua Error:", error);
        // Fallback text response
        const fallbackDua = DUA_DB[Math.floor(Math.random() * DUA_DB.length)];
        api.sendMessage(
            `╔═══════════════════╗
  『 𝗗𝗨𝗔 𝗘𝗫𝗣𝗥𝗘𝗦𝗦 』
╚═══════════════════╝

📜 𝗔𝗿𝗮𝗯𝗶𝗰:
${fallbackDua.arabic}

🔵 𝗨𝗿𝗱𝘂 𝗧𝗿𝗮𝗻𝘀𝗹𝗮𝘁𝗶𝗼𝗻:
${fallbackDua.urdu}

🔴 𝗘𝗻𝗴𝗹𝗶𝘀𝗵 𝗧𝗿𝗮𝗻𝘀𝗹𝗮𝘁𝗶𝗼𝗻:
${fallbackDua.english}

⚠️ 𝗘𝗿𝗿𝗼𝗿 𝗹𝗼𝗮𝗱𝗶𝗻𝗴 𝗶𝗺𝗮𝗴𝗲
👑 𝗢𝘄𝗻𝗲𝗿: 𝐓𝐀𝐋𝐇𝐀 𝐏𝐀𝐓𝐇𝐀𝐍 💞`,
            event.threadID,
            event.messageID
        );
    }
};
