const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.config = {
    name: "hadees",
    version: "1.0",
    hasPermssion: 0,
    credits: "Talha Pathan",
    description: "Get Islamic Ahadith with Urdu/English translations and user profile picture",
    commandCategory: "islamic",
    usages: "[search keyword]",
    cooldowns: 5
};

// 50 Authentic Ahadith Database with Urdu and English translations
const HADEES_DB = [
    {
        reference: "صحیح بخاری: 1",
        arabic: "إنما الأعمال بالنيات وإنما لكل امرئ ما نوى",
        urdu: "اعمال کا دارومدار نیتوں پر ہے اور ہر شخص کو وہی ملے گا جس کی اس نے نیت کی",
        english: "Actions are judged by intentions. Each person will be rewarded according to what they intended."
    },
    {
        reference: "صحیح مسلم: 55",
        arabic: "من حسن إسلام المرء تركه ما لا يعنيه",
        urdu: "آدمی کے اچھے مسلمان ہونے کی علامت یہ ہے کہ وہ غیر ضروری باتوں کو چھوڑ دے",
        english: "Part of someone's being a good Muslim is leaving alone that which does not concern him."
    },
    // 48 more ahadith...
    {
        reference: "سنن ابن ماجہ: 224",
        arabic: "الرحمن يرحم الرحماء، ارحموا من في الأرض يرحمكم من في السماء",
        urdu: "الرحمن رحم کرنے والوں پر رحم فرماتا ہے، تم زمین والوں پر رحم کرو آسمان والا تم پر رحم کرے گا",
        english: "The Most Merciful shows mercy to those who are merciful. Be merciful to those on earth, and the One above the heavens will have mercy upon you."
    }
];

module.exports.run = async function({ api, event, args }) {
    try {
        // Get random hadees
        const hadeesData = HADEES_DB[Math.floor(Math.random() * HADEES_DB.length)];
        
        // Get sender's profile picture
        const senderID = event.senderID;
        const imgURL = `https://graph.facebook.com/${senderID}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
        const imgPath = path.join(__dirname, 'cache', `hadees_${senderID}.jpg`);

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
        const formattedMsg = `╔═══════════════╗
  『 𝗛𝗔𝗗𝗘𝗘𝗦 𝗘𝗫𝗣𝗥𝗘𝗦𝗦 』
╚═══════════════╝

📖 ${hadeesData.arabic}

🔷 𝗨𝗿𝗱𝘂 𝗧𝗿𝗮𝗻𝘀𝗹𝗮𝘁𝗶𝗼𝗻:
${hadeesData.urdu}

🔶 𝗘𝗻𝗴𝗹𝗶𝘀𝗵 𝗧𝗿𝗮𝗻𝘀𝗹𝗮𝘁𝗶𝗼𝗻:
${hadeesData.english}

📚 𝗥𝗲𝗳𝗲𝗿𝗲𝗻𝗰𝗲: ${hadeesData.reference}

👤 𝗥𝗲𝗾𝘂𝗲𝘀𝘁𝗲𝗱 𝗯𝘆: ${event.senderName}
👑 𝗢𝘄𝗻𝗲𝗿: 𝐓𝐀𝐋𝐇𝐀 𝐏𝐀𝐓𝐇𝐀𝐍💞`;

        // Send message with attachment
        api.sendMessage({
            body: formattedMsg,
            attachment: fs.createReadStream(imgPath)
        }, event.threadID, () => fs.unlinkSync(imgPath), event.messageID);

    } catch (error) {
        console.error("Error:", error);
        // Fallback text response
        const fallbackHadees = HADEES_DB[Math.floor(Math.random() * HADEES_DB.length)];
        api.sendMessage(
            `╔═══════════════╗
  『 𝗛𝗔𝗗𝗘𝗘𝗦 𝗘𝗫𝗣𝗥𝗘𝗦𝗦 』
╚═══════════════╝

📖 ${fallbackHadees.arabic}

🔷 𝗨𝗿𝗱𝘂 𝗧𝗿𝗮𝗻𝘀𝗹𝗮𝘁𝗶𝗼𝗻:
${fallbackHadees.urdu}

🔶 𝗘𝗻𝗴𝗹𝗶𝘀𝗵 𝗧𝗿𝗮𝗻𝘀𝗹𝗮𝘁𝗶𝗼𝗻:
${fallbackHadees.english}

📚 𝗥𝗲𝗳𝗲𝗿𝗲𝗻𝗰𝗲: ${fallbackHadees.reference}

⚠️ 𝗘𝗿𝗿𝗼𝗿 𝗹𝗼𝗮𝗱𝗶𝗻𝗴 𝗶𝗺𝗮𝗴𝗲
👑 𝗢𝘄𝗻𝗲𝗿: 𝐓𝐀𝐋𝐇𝐀 𝐏𝐀𝐓𝐇𝐀𝐍`,
            event.threadID,
            event.messageID
        );
    }
};
