const axios = require("axios");
const fs = require("fs-extra");

// ========== CONFIGURATION ========== //
const BASE_API_URL = "https://your-new-api-domain.com/api/ephoto"; // CHANGE THIS TO YOUR API URL

module.exports.config = {
  name: "ephoto",
  version: "11.0.0",
  hasPermssion: 0,
  credits: "M_TALHA",
  usePrefix: true,
  description: "Create logos using ephoto API",
  commandCategory: "logo",
  usages: "ephoto list [page] | ephoto [type] [text]",
  cooldowns: 2
};

// ========== COMPLETE LOGO LIST DATA ========== //
const LOGO_LISTS = {
  1: `🖼️ Logo List - Page 1/3:
1. television     11. typography     21. sunlight
2. glass          12. leaves         22. pig
3. blackpink      13. cloth          23. Halloween
4. neonblacpink   14. graffiti       24. leafgrafy
5. coverpubg      15. star           25. water
6. greenbrush     16. typography2    26. animate
7. blueneon       17. nightstars     27. puppy
8. eraser         18. cloud          28. foggy
9. dragonfire     19. papercut       29. flag
10. bulb          20. horror         30. arrow`,

  2: `🖼️ Logo List - Page 2/3:
31. arrow2        41. gaminglogo     51. galaxy
32. hacker        42. game           52. goldavatar
33. avatar        43. vibrant        53. team2
34. moblegend     44. blueneon       54. shield
35. warface       45. steelmetal     55. angel
36. foggy2        46. mascot         56. queen
37. gammergirl    47. luxurylogo     57. gaminglogo2
38. teamlogo      48. star           58. zodiac
39. beach         49. minimal        59. steel2
40. neonstyle     50. team2          60. pubg2`,

  3: `🖼️ Logo List - Page 3/3:
61. pubg3         71. moblegend2     81. cake5
62. fbcover       72. neonstyle2     82. cake6
63. fbcover2      73. arena          83. cake7
64. fbcover3      74. lovecard       84. cup
65. fbcover4      75. lovecard2      85. flaming
66. fbcover5      76. lovecard3      86. blood
67. fbcover6      77. heartwing      87. blood2
68. fbcover7      78. cake           88. crossfire
69. fbcover8      79. cake2          89. freefire
70. tattoo        80. cake3          90. overwatch`
};

// ========== COMPLETE LOGO CONFIGURATIONS ========== //
const LOGO_CONFIGS = {
  // Page 1 Logos
  television: { endpoint: "/television", message: "📺 Television Logo" },
  glass: { endpoint: "/glasses", message: "👓 Glass Effect Logo" },
  blackpink: { endpoint: "/blackpink", message: "🖤 Blackpink Style Logo" },
  neonblacpink: { endpoint: "/neonbp", message: "💖 Neon Blackpink Logo" },
  coverpubg: { endpoint: "/coverpubg", message: "🎮 PUBG Cover Logo" },
  greenbrush: { endpoint: "/greenbrush", message: "🖌️ Green Brush Logo" },
  blueneon: { endpoint: "/neonblue", message: "🔵 Blue Neon Logo" },
  eraser: { endpoint: "/eraser", message: "✏️ Eraser Effect Logo" },
  dragonfire: { endpoint: "/dragonfire", message: "🐉 Dragon Fire Logo" },
  bulb: { endpoint: "/incandescent", message: "💡 Light Bulb Logo" },
  typography: { endpoint: "/typography", message: "🔠 Typography Logo" },
  leaves: { endpoint: "/letters", message: "🍃 Leaves Letters Logo" },
  cloth: { endpoint: "/cloth", message: "👕 Cloth Texture Logo" },
  graffiti: { endpoint: "/graffiti", message: "🎨 Graffiti Style Logo" },
  star: { endpoint: "/metals", message: "⭐ Metal Star Logo" },
  typography2: { endpoint: "/typography2", message: "🔡 Typography 2 Logo" },
  nightstars: { endpoint: "/nightstars", message: "🌃 Night Stars Logo" },
  cloud: { endpoint: "/cloud", message: "☁️ Cloud Style Logo" },
  papercut: { endpoint: "/caper", message: "✂️ Paper Cut Logo" },
  horror: { endpoint: "/horror", message: "👻 Horror Style Logo" },
  sunlight: { endpoint: "/sunlight", message: "☀️ Sunlight Effect Logo" },
  pig: { endpoint: "/pig", message: "🐷 Pig Character Logo" },
  halloween: { endpoint: "/hallowen", message: "🎃 Halloween Logo" },
  leafgrafy: { endpoint: "/leafgraphy", message: "🌿 Leafography Logo" },
  water: { endpoint: "/water", message: "💧 Water Effect Logo" },
  animate: { endpoint: "/crank", message: "🌀 Animated Style Logo" },
  puppy: { endpoint: "/puppy", message: "🐶 Puppy Logo" },
  foggy: { endpoint: "/foggy", message: "🌫️ Foggy Effect Logo" },
  flag: { endpoint: "/american", message: "🇺🇸 Flag Logo" },
  arrow: { endpoint: "/arrow", message: "➡️ Arrow Logo" },

  // Page 2 Logos
  arrow2: { endpoint: "/arrow2", message: "⏩ Arrow 2 Logo" },
  hacker: { endpoint: "/anonymous", message: "👨💻 Hacker Style Logo" },
  avatar: { endpoint: "/aov", message: "👤 Avatar Logo" },
  moblegend: { endpoint: "/ml", message: "⚔️ Mobile Legends Logo" },
  warface: { endpoint: "/warface", message: "🔫 Warface Logo" },
  foggy2: { endpoint: "/window", message: "🪟 Foggy Window Logo" },
  gammergirl: { endpoint: "/gamergirl", message: "👧 Gamer Girl Logo" },
  teamlogo: { endpoint: "/teamlogo", message: "🏆 Team Logo" },
  beach: { endpoint: "/beach", message: "🏖️ Beach Style Logo" },
  neonstyle: { endpoint: "/neonstyle", message: "💈 Neon Style Logo" },
  gaminglogo: { endpoint: "/gaminglogo", message: "🎮 Gaming Logo" },
  game: { endpoint: "/fpsgame", message: "🕹️ Game Logo" },
  vibrant: { endpoint: "/vibrant", message: "🌈 Vibrant Color Logo" },
  steelmetal: { endpoint: "/steelmetal", message: "🔩 Steel Metal Logo" },
  mascot: { endpoint: "/circlemascot", message: "👾 Mascot Logo" },
  luxurylogo: { endpoint: "/luxuarylogo", message: "💎 Luxury Logo" },
  minimal: { endpoint: "/minimal", message: "➖ Minimalist Logo" },
  galaxy: { endpoint: "/galaxy", message: "🌌 Galaxy Logo" },
  goldavatar: { endpoint: "/goldavatar", message: "💰 Gold Avatar Logo" },
  team2: { endpoint: "/team2", message: "👥 Team 2 Logo" },
  shield: { endpoint: "/sheild", message: "🛡️ Shield Logo" },
  angel: { endpoint: "/angel2", message: "👼 Angel Logo" },
  queen: { endpoint: "/queen", message: "👑 Queen Logo" },
  gaminglogo2: { endpoint: "/gaminglogo2", message: "🎮 Gaming Logo 2" },
  zodiac: { endpoint: "/zodiac", message: "♈ Zodiac Logo" },
  steel2: { endpoint: "/steel2", message: "⚙️ Steel 2 Logo" },
  pubg2: { endpoint: "/pubg2", message: "🎯 PUBG 2 Logo" },
  pubg3: { endpoint: "/pubg3", message: "🔫 PUBG 3 Logo" },

  // Page 3 Logos
  fbcover: { endpoint: "/facebookcover4", message: "📘 Facebook Cover" },
  fbcover2: { endpoint: "/facebookcover5", message: "📗 Facebook Cover 2" },
  fbcover3: { endpoint: "/facebookcover6", message: "📕 Facebook Cover 3" },
  fbcover4: { endpoint: "/facebookcover7", message: "📓 Facebook Cover 4" },
  fbcover5: { endpoint: "/facebookcover8", message: "📔 Facebook Cover 5" },
  fbcover6: { endpoint: "/facebookcover9", message: "📒 Facebook Cover 6" },
  fbcover7: { endpoint: "/facebookcover11", message: "📙 Facebook Cover 7" },
  fbcover8: { endpoint: "/facebookcover12", message: "📚 Facebook Cover 8" },
  tattoo: { endpoint: "/tatto", message: "💉 Tattoo Style Logo" },
  moblegend2: { endpoint: "/ml2", message: "🗡️ Mobile Legends 2 Logo" },
  neonstyle2: { endpoint: "/neonstyle", message: "🔮 Neon Style 2 Logo" },
  arena: { endpoint: "/arena", message: "🏟️ Arena Logo" },
  lovecard: { endpoint: "/lovecard2", message: "💌 Love Card" },
  lovecard2: { endpoint: "/lovecard3", message: "💝 Love Card 2" },
  lovecard3: { endpoint: "/lovecard4", message: "💘 Love Card 3" },
  heartwing: { endpoint: "/winggif", message: "💞 Heart Wings Logo" },
  cake: { endpoint: "/cake2", message: "🎂 Cake Logo" },
  cake2: { endpoint: "/cake3", message: "🍰 Cake 2 Logo" },
  cake3: { endpoint: "/cake4", message: "🧁 Cake 3 Logo" },
  cake4: { endpoint: "/cake5", message: "🥮 Cake 4 Logo" },
  cake5: { endpoint: "/cake6", message: "🍥 Cake 5 Logo" },
  cake6: { endpoint: "/cake7", message: "🍬 Cake 6 Logo" },
  cup: { endpoint: "/cup", message: "🏆 Cup Logo" },
  flaming: { endpoint: "/flaming", message: "🔥 Flaming Text Logo" },
  blood: { endpoint: "/blood", message: "🩸 Blood Effect Logo" },
  blood2: { endpoint: "/blood2", message: "💉 Blood 2 Logo" },
  crossfire: { endpoint: "/crossfire", message: "🔫 Crossfire Logo" },
  freefire: { endpoint: "/freefire3", message: "🎯 Free Fire Logo" },
  overwatch: { endpoint: "/overwatch2", message: "👁️ Overwatch Logo" }
};

// ========== MAIN FUNCTION ========== //
module.exports.run = async function ({ api, event, args }) {
  const { messageID, threadID } = event;

  // Handle list command
  if (args[0]?.toLowerCase() === "list") {
    const page = parseInt(args[1]) || 1;
    return api.sendMessage(
      LOGO_LISTS[page] || "❌ Invalid page! Please use 1, 2 or 3",
      threadID,
      messageID
    );
  }

  // Validate command
  if (args.length < 2) {
    return api.sendMessage(
      `🛠️ Usage:\n• ephoto list [page]\n• ephoto [type] [text]\n\nExample: ephoto glitch Hello World`,
      threadID,
      messageID
    );
  }

  const [type, ...nameArr] = args;
  const name = nameArr.join(" ");
  const pathImg = __dirname + `/cache/${type}_${name}.png`;

  // Get logo configuration
  const config = LOGO_CONFIGS[type.toLowerCase()];
  if (!config) {
    return api.sendMessage(
      `❌ Invalid logo type! Use "ephoto list" to see available logos.`,
      threadID,
      messageID
    );
  }

  try {
    api.sendMessage("🔄 Creating your logo, please wait...", threadID, messageID);

    const apiUrl = `${BASE_API_URL}${config.endpoint}?text=${encodeURIComponent(name)}`;
    const response = await axios.get(apiUrl, { responseType: "arraybuffer" });
    
    fs.writeFileSync(pathImg, Buffer.from(response.data));
    
    await api.sendMessage(
      { 
        body: `✅ ${config.message}\n📝 Text: ${name}`,
        attachment: fs.createReadStream(pathImg) 
      },
      threadID
    );

    fs.unlinkSync(pathImg);
  } catch (error) {
    console.error("Logo Creation Error:", error);
    api.sendMessage(
      "❌ Error creating logo. The API might be down or your text is too long.",
      threadID,
      messageID
    );
  }
};
