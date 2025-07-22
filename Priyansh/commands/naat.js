const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.config = {
    name: "naat",
    version: "2.0",
    hasPermssion: 0,
    credits: "Talha Pathan",
    description: "Play viral Urdu Naats with Allah's image",
    commandCategory: "islamic",
    usages: "[search]",
    cooldowns: 15
};

// 100 Viral Urdu Naats Database with Audio Links
const NAAT_DB = [
    {
        title: "Mere Maula Karam Farmaa",
        lyrics: "میرے مولا کرم فرما، میرے حال پہ رحم فرما\nمجھے اپنا بنا لے، مجھے اپنا بنا لے",
        reciter: "Junaid Jamshed",
        audio: "https://example.com/naat1.mp3" // Replace with actual audio URLs
    },
    {
        title: "Dil Se Dilbar",
        lyrics: "دل سے دلبر تک جس نے راہ بنائی\nوہی راہوں کا مسافر ہو محمدﷺ",
        reciter: "Owais Raza Qadri",
        audio: "https://example.com/naat2.mp3"
    },
    // Add 98 more naats...
    {
        title: "Taajdar-e-Haram",
        lyrics: "تاجدار حرم ہو نبیﷺ کے چہرے کے نور ہو\nآپﷺ کی ذات پہ لاکھوں سلام ہو",
        reciter: "Sami Yusuf",
        audio: "https://example.com/naat100.mp3"
    }
];

module.exports.run = async function({ api, event, args }) {
    try {
        // Get random naat
        const naatData = NAAT_DB[Math.floor(Math.random() * NAAT_DB.length)];
        
        // Download Allah image
        const allahImageURL = "https://i.imgur.com/9hRjZ7y.jpg"; // High quality Allah name image
        const imagePath = path.join(__dirname, 'cache', 'allah_image.jpg');
        
        const imgResponse = await axios({
            method: 'GET',
            url: allahImageURL,
            responseType: 'stream'
        });
        
        const imgWriter = fs.createWriteStream(imagePath);
        imgResponse.data.pipe(imgWriter);
        
        await new Promise((resolve, reject) => {
            imgWriter.on('finish', resolve);
            imgWriter.on('error', reject);
        });

        // Download naat audio
        const audioPath = path.join(__dirname, 'cache', 'naat_audio.mp3');
        const audioResponse = await axios({
            method: 'GET',
            url: naatData.audio,
            responseType: 'stream'
        });
        
        const audioWriter = fs.createWriteStream(audioPath);
        audioResponse.data.pipe(audioWriter);
        
        await new Promise((resolve, reject) => {
            audioWriter.on('finish', resolve);
            audioWriter.on('error', reject);
        });

        // Stylish message format
        const formattedMsg = `╭───────────────────╮
   『 𝗡𝗔𝗔𝗧 𝗦𝗛𝗔𝗥𝗜𝗙 』
╰───────────────────╯

🎵 𝗧𝗶𝘁𝗹𝗲: ${naatData.title}
🎤 𝗥𝗲𝗰𝗶𝘁𝗲𝗿: ${naatData.reciter}

📜 𝗟𝘆𝗿𝗶𝗰𝘀:
${naatData.lyrics}

👑 𝗢𝘄𝗻𝗲𝗿: 𝐓𝐀𝐋𝐇𝐀 𝐏𝐀𝐓𝐇𝐀𝐍 💞`;

        // Send message with audio and image
        api.sendMessage({
            body: formattedMsg,
            attachment: [
                fs.createReadStream(imagePath),
                fs.createReadStream(audioPath)
            ]
        }, event.threadID, () => {
            fs.unlinkSync(imagePath);
            fs.unlinkSync(audioPath);
        }, event.messageID);

    } catch (error) {
        console.error("Naat Error:", error);
        // Fallback text response
        const fallbackNaat = NAAT_DB[Math.floor(Math.random() * NAAT_DB.length)];
        api.sendMessage(
            `🎵 𝗡𝗮𝘂𝘁 𝗦𝗵𝗮𝗿𝗶𝗳\n\n` +
            `𝗧𝗶𝘁𝗹𝗲: ${fallbackNaat.title}\n` +
            `𝗥𝗲𝗰𝗶𝘁𝗲𝗿: ${fallbackNaat.reciter}\n\n` +
            `𝗟𝘆𝗿𝗶𝗰𝘀:\n${fallbackNaat.lyrics}\n\n` +
            `⚠️ 𝗘𝗿𝗿𝗼𝗿 𝗹𝗼𝗮𝗱𝗶𝗻𝗴 𝗺𝗲𝗱𝗶𝗮\n` +
            `👑 𝗢𝘄𝗻𝗲𝗿: 𝐓𝐀𝐋𝐇𝐀 𝐏𝐀𝐓𝐇𝐀𝐍 💞`,
            event.threadID,
            event.messageID
        );
    }
};
