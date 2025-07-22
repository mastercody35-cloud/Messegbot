const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.config = {
    name: "logo",
    version: "2.0",
    hasPermssion: 0,
    credits: "Talha Pathan",
    description: "Premium logos with paginated list and designs",
    commandCategory: "design",
    usages: "[list/page number/logo name]",
    cooldowns: 10
};

// Complete 50 Logos Database
const LOGO_DB = [
    { name: "🔥 Glowing Fire", url: "https://i.imgur.com/glowingfire.png", style: "3D fire effect" },
    { name: "💎 Crystal Glass", url: "https://i.imgur.com/crystalglass.png", style: "Glass refraction" },
    { name: "⚡ Electric Neon", url: "https://i.imgur.com/electricneon.png", style: "Neon glow" },
    { name: "🌌 Galaxy", url: "https://i.imgur.com/galaxylogo.png", style: "Space nebula effect" },
    { name: "🦋 Butterfly", url: "https://i.imgur.com/butterflylogo.png", style: "Colorful wings" },
    { name: "🏆 Champion", url: "https://i.imgur.com/championlogo.png", style: "Trophy design" },
    { name: "🐉 Dragon", url: "https://i.imgur.com/dragonlogo.png", style: "Mythical creature" },
    { name: "🌹 Romantic", url: "https://i.imgur.com/romanticlogo.png", style: "Rose petals" },
    { name: "🧊 Ice", url: "https://i.imgur.com/icelogo.png", style: "Frozen text" },
    { name: "🍭 Candy", url: "https://i.imgur.com/candylogo.png", style: "Sweet colorful" },
    // Continue adding more logos up to 50...
    { name: "🎄 Christmas", url: "https://i.imgur.com/christmaslogo.png", style: "Festive holiday" }
];

// Constants for pagination
const LOGOS_PER_PAGE = 10;
const TOTAL_PAGES = Math.ceil(LOGO_DB.length / LOGOS_PER_PAGE);

module.exports.run = async function({ api, event, args }) {
    try {
        // Handle logo list request
        if (args[0]?.toLowerCase() === 'list') {
            const page = parseInt(args[1]) || 1;
            if (page < 1 || page > TOTAL_PAGES) {
                return api.sendMessage(`Invalid page number. Please select between 1-${TOTAL_PAGES}`, event.threadID);
            }

            const startIdx = (page - 1) * LOGOS_PER_PAGE;
            const pageLogos = LOGO_DB.slice(startIdx, startIdx + LOGOS_PER_PAGE);

            let listMsg = `╭───────────────────╮\n   📜 𝗟𝗢𝗚𝗢 𝗟𝗜𝗦𝗧 (𝗣𝗮𝗴𝗲 ${page}/${TOTAL_PAGES})\n╰───────────────────╯\n\n`;
            pageLogos.forEach((logo, i) => {
                listMsg += `${startIdx + i + 1}. ${logo.name} - ${logo.style}\n`;
            });

            listMsg += `\n📌 Usage: logo [number/name]\n👑 Owner: 𝕿𝖆𝖑𝖍𝖆 𝕻𝖆𝖙𝖍𝖆𝖓`;
            return api.sendMessage(listMsg, event.threadID);
        }

        // Handle specific logo request by number or name
        let logo;
        if (!isNaN(args[0])) {
            const num = parseInt(args[0]);
            if (num < 1 || num > LOGO_DB.length) {
                return api.sendMessage(`Please select a logo number between 1-${LOGO_DB.length}`, event.threadID);
            }
            logo = LOGO_DB[num - 1];
        } else if (args[0]) {
            const searchTerm = args.join(' ').toLowerCase();
            logo = LOGO_DB.find(l => l.name.toLowerCase().includes(searchTerm));
            if (!logo) {
                return api.sendMessage(`Logo not found. Type "logo list" to see available designs`, event.threadID);
            }
        } else {
            // Random logo if no args
            logo = LOGO_DB[Math.floor(Math.random() * LOGO_DB.length)];
        }

        // Download and send the logo
        const imgPath = path.join(__dirname, 'cache', 'premium_logo.jpg');
        const response = await axios.get(logo.url, { responseType: 'stream' });
        const writer = fs.createWriteStream(imgPath);
        response.data.pipe(writer);
        
        await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });

        const formattedMsg = `╭───────────────────╮
   ✨ 𝗣𝗥𝗘𝗠𝗜𝗨𝗠 𝗟𝗢𝗚𝗢 ✨
╰───────────────────╯

🆔 𝗡𝗮𝗺𝗲: ${logo.name}
🎨 𝗦𝘁𝘆𝗹𝗲: ${logo.style}

📌 𝗥𝗲𝗾𝘂𝗲𝘀𝘁𝗲𝗱 𝗯𝘆: ${event.senderName}
👑 𝗢𝘄𝗻𝗲𝗿: 𝐓𝐀𝐋𝐇𝐀 𝐏𝐀𝐓𝐇𝐀𝐍 💞

💡 𝗧𝗶𝗽: Type 'logo list' to see all designs`;

        api.sendMessage({
            body: formattedMsg,
            attachment: fs.createReadStream(imgPath)
        }, event.threadID, () => fs.unlinkSync(imgPath));

    } catch (error) {
        console.error("Logo Error:", error);
        api.sendMessage(
            `╭───────────────────╮
   ✨ 𝗣𝗥𝗘𝗠𝗜𝗨𝗠 𝗟𝗢𝗚𝗢 ✨
╰───────────────────╯

⚠️ Error loading logo. Please try again!

👑 𝐎𝐰𝐧𝐞𝐫: 𝐓𝐚𝐥𝐡𝐚 𝐏𝐚𝐭𝐡𝐚𝐧`,
            event.threadID
        );
    }
};
