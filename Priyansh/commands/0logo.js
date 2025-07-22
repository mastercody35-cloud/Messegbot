const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.config = {
  name: "logo",
  version: "3.0",
  hasPermssion: 0,
  credits: "Talha Pathan",
  description: "Send cool logos with preview list",
  commandCategory: "design",
  usages: "[list/page number/logo name]",
  cooldowns: 5
};

const LOGO_DB = [
  { name: "Glowing Fire", url: "https://i.imgur.com/BsY0Oqg.jpg", style: "🔥 Fire Style" },
  { name: "Neon Light", url: "https://i.imgur.com/LmsbTzz.jpg", style: "🌟 Neon Effect" },
  { name: "Crystal Shine", url: "https://i.imgur.com/sE2JqEj.jpg", style: "💎 Crystal Logo" },
  { name: "Dark Metal", url: "https://i.imgur.com/HnKJ0Z9.jpg", style: "⚙️ Steel Style" },
  { name: "Water Splash", url: "https://i.imgur.com/3zTT2Er.jpg", style: "💧 Aqua Logo" },
  { name: "Sky Gradient", url: "https://i.imgur.com/DYj2fSH.jpg", style: "🌈 Sky Style" },
  { name: "Smoke Shadow", url: "https://i.imgur.com/fAnB40x.jpg", style: "☁️ Smoke FX" },
  { name: "Retro Pixel", url: "https://i.imgur.com/zs1FYe7.jpg", style: "🕹️ Pixel Art" },
  { name: "Cyber Grid", url: "https://i.imgur.com/c8DVR6C.jpg", style: "💻 Cyber Grid" },
  { name: "Rainbow Text", url: "https://i.imgur.com/3RzG9sz.jpg", style: "🌈 Rainbow Vibes" },
  // Add 40 more...
  { name: "Gold Royal", url: "https://i.imgur.com/Sm7bzQo.jpg", style: "👑 Gold Text" },
  { name: "Glitch FX", url: "https://i.imgur.com/Iuf9kqO.jpg", style: "🔧 Glitch Style" },
  { name: "Thunder Text", url: "https://i.imgur.com/hDw1YZL.jpg", style: "⚡ Thunder Glow" },
  { name: "Lava Heat", url: "https://i.imgur.com/o6q6Qei.jpg", style: "🌋 Lava Theme" },
  { name: "Ice Letters", url: "https://i.imgur.com/tqD9zH2.jpg", style: "❄️ Frozen Font" },
  { name: "Metal Steel", url: "https://i.imgur.com/nKqxdS4.jpg", style: "🔩 Steel Cut" },
  { name: "Ink Style", url: "https://i.imgur.com/ctO2N8J.jpg", style: "🖋️ Ink Flow" },
  { name: "Magic Dust", url: "https://i.imgur.com/LHqZl8s.jpg", style: "✨ Fairy Dust" },
  { name: "Laser Burn", url: "https://i.imgur.com/IRNReI5.jpg", style: "🔴 Laser Shot" },
  { name: "Night Glare", url: "https://i.imgur.com/rjQ1F7R.jpg", style: "🌌 Night Mode" },
  // Add up to 50 total logos
];

const LOGOS_PER_PAGE = 10;
const TOTAL_PAGES = Math.ceil(LOGO_DB.length / LOGOS_PER_PAGE);

module.exports.run = async function({ api, event, args }) {
  try {
    const input = args.join(" ").toLowerCase();

    if (input.startsWith("list")) {
      const page = parseInt(args[1]) || 1;
      if (page < 1 || page > TOTAL_PAGES) {
        return api.sendMessage(`❌ Invalid page. Use 1 to ${TOTAL_PAGES}`, event.threadID);
      }

      const start = (page - 1) * LOGOS_PER_PAGE;
      const logos = LOGO_DB.slice(start, start + LOGOS_PER_PAGE);
      let listText = `🖼️ 𝗟𝗢𝗚𝗢 𝗟𝗜𝗦𝗧 (Page ${page}/${TOTAL_PAGES})\n\n`;

      logos.forEach((logo, i) => {
        listText += `${start + i + 1}. ${logo.name} (${logo.style})\n`;
      });

      listText += `\nUse: logo [name or number]\nExample: logo 3\n\n✨ 𝑴𝑨𝑫𝑬 𝑩𝒀 𝑻𝑨𝑳𝑯𝑨 𝑷𝑨𝑻𝑯𝑨𝑵\n📎 fb.com/yourusername\n👑 Owner: Talha Pathan`;
      return api.sendMessage(listText, event.threadID);
    }

    let logo;
    if (!isNaN(input) && parseInt(input) > 0 && parseInt(input) <= LOGO_DB.length) {
      logo = LOGO_DB[parseInt(input) - 1];
    } else if (input) {
      logo = LOGO_DB.find(l => l.name.toLowerCase().includes(input));
    } else {
      logo = LOGO_DB[Math.floor(Math.random() * LOGO_DB.length)];
    }

    if (!logo) {
      return api.sendMessage(`❌ Logo not found. Use "logo list" to view available logos.`, event.threadID);
    }

    const imgPath = path.join(__dirname, 'cache', `${logo.name.replace(/\s+/g, '_')}.jpg`);
    const response = await axios.get(logo.url, { responseType: 'stream' });

    await new Promise((resolve, reject) => {
      const stream = fs.createWriteStream(imgPath);
      response.data.pipe(stream);
      stream.on('finish', resolve);
      stream.on('error', reject);
    });

    const bodyMsg = `✨ 𝙏𝙃𝙄𝙎 𝙇𝙊𝙂𝙊 𝙈𝘼𝘿𝙀 𝘽𝙔 𝙏𝘼𝙇𝙃𝘼 𝙋𝘼𝙏𝙃𝘼𝙉\n🖼️ 𝐍𝐚𝐦𝐞: ${logo.name}\n🎨 𝐒𝐭𝐲𝐥𝐞: ${logo.style}\n📎𝐎𝐰𝐧𝐞𝐫 𝐅𝐛.https://www.facebook.com/share/193GypVyJQ/\n👑 𝐎𝐰𝐧𝐞𝐫: 𝐓𝐚𝐥𝐡𝐚 𝐏𝐚𝐭𝐡𝐚𝐧`;

    api.sendMessage({
      body: bodyMsg,
      attachment: fs.createReadStream(imgPath)
    }, event.threadID, () => fs.unlinkSync(imgPath));

  } catch (err) {
    console.error(err);
    api.sendMessage(`⚠️ Failed to send logo. Try again later.`, event.threadID);
  }
};
