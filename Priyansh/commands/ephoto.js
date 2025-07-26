const axios = require("axios");
const request = require("request");
const fs = require("fs-extra");

module.exports.config = {
  name: "ephoto",
  version: "11.0.0",
  hasPermssion: 0,
  credits: `THE_FAHEEM`,
  usePrefix: true,
  description: "Make your own logo using ephoto",
  commandCategory: "logo",
  usages: "ephoto list or textpro list (page number) or textpro (logo) (text)",
  cooldowns: 2,
};

module.exports.run = async function ({ api, event, args, Users }) {
  let { messageID, senderID, threadID } = event;

  if (args.length >= 2 && args[0].toLowerCase() === "list") {
    let page = parseInt(args[1]);
    switch (page) {
      case 1:
        return api.sendMessage(
          `here's the logo list - Page 1:\n1. television\n2. glass\n3. blackpink\n4. neonblacpink\n5. coverpubg\n6. greenbrush\n7. blueneon\n8. eraser\n9. dragonfire\n10. bulb\n11. typography\n12. leaves\n13. cloth\n14. graffiti\n15. star\n16. typography2\n17. nightstars\n18. cloud\n19. papercut\n20. horror\n21. sunlight\n22. pig\n23. Halloween\n24. leafgrafy\n25. water\n26. animate\n27. puppy\n28. foggy\n29. flag\n30. arrow\n\nPAGE 1 - 3`,
          threadID,
          messageID
        );
      case 2:
        return api.sendMessage(
          `Logo list - Page 2:\n31. arrow2\n32. hacker\n33. avatar\n34. moblegend\n35. warface\n36. foggy2\n37. gammergirl\n38. teamlogo\n39. beach\n40. neonstyle\n41. gaminglogo\n42. game\n43. vibrant\n44. blueneon\n45. steelmetal\n46. mascot\n47. luxurylogo\n48. star\n50. minimal\n51. galaxy\n52. goldavatar\n53. team2\n54. shield\n55. angel\n56. queen\n57. gaminglogo2\n58. zodiac\n59. steel2\n60. pubg2\n61. pubg3\n\nPAGE 2 - 3`,
          threadID,
          messageID
        );
      case 3:
        return api.sendMessage(
          `Logo list - Page 3:\n62. fbcover\n63. fbcover2\n64. fbcover3\n65. fbcover4\n66. fbcover5\n67. fbcover6\n68. fbcover7\n69. fbcover8\n70. tattoo\n71. moblegend2\n72. neonstyle2\n73. arena\n74. lovecard\n75. lovecard2\n76. lovecard3\n77. heartwing\n78. cake\n79. cake2\n80. cake3\n81. cake4\n82. cake5\n83. cake6\n84. cake7\n85. cup\n86. flaming\n87. blood\n88. blood2\n89. crossfire\n90. freefire\n91. overwatch\n92. lolavata\n93. dota\n94. exposure`,
          threadID,
          messageID
        );
      default:
        return api.sendMessage(
          `Invalid page number! Please use "list 1" or "list 2" or "list 3 in the total of list there are 100 Ephoto logo for now.".`,
          threadID,
          messageID
        );
    }
  }

  if (args.length < 2) {
    return api.sendMessage(
      `Invalid command format! Use: Ephoto list or Ephoto list (page number) or Ephoto (logo) (text)`,
      threadID,
      messageID
    );
  }

  let type = args[0].toLowerCase();
  let name = args.slice(1).join(" ");
  let pathImg = __dirname + `/cache/${type}_${name}.png`;
  let apiUrl, message;

  switch (type) {
    case "television":
      apiUrl = `https://site--faaheem--hzpgqj8xq64k.code.run/api/ephoto/television?text=${name}`;
      message = "here's the [TELEVISION] Logo created:";
      break;
    case "glass":
      apiUrl = `https://site--faaheem--hzpgqj8xq64k.code.run/api/ephoto/glasses?text=${name}`;
      message = "here's the [ GLASS ] Logo created:";
      break;
    case "blackpink":
      apiUrl = `https://site--faaheem--hzpgqj8xq64k.code.run/api/ephoto/blackpink?text=${name}`;
      message = "here's the [ BLACKPINK ] Logo created:";
      break;
    case "neonblacpink":
      apiUrl = `https://site--faaheem--hzpgqj8xq64k.code.run/api/ephoto/neonbp?text=${name}`;
      message = "here's the [ NEON BLACK PINK] Logo Created:";
      break;
    case "coverpubg":
      apiUrl = `https://site--faaheem--hzpgqj8xq64k.code.run/api/ephoto/coverpubg?text=${name}`;
      message = "here's the [ COVER PUBG ] - Logo Created:";
      break;
    case "greenbrush":
      apiUrl = `https://site--faaheem--hzpgqj8xq64k.code.run/api/ephoto/greenbrush?text=${name}`;
      message = "here's the [ GREENBRUSH ] Logo Created:";
      break;
    case "blueneon":
      apiUrl = `https://site--faaheem--hzpgqj8xq64k.code.run/api/ephoto/neonblue?text=${name}`;
      message = "here's the [ BLUE NEON ] Logo created:";
      break;
    case "eraser":
      apiUrl = `https://site--faaheem--hzpgqj8xq64k.code.run/api/ephoto/eraser?text=${name}`;
      message = "here's the [ ERASER ] Logo created:";
      break;
    case "dragonfire":
      apiUrl = `https://site--faaheem--hzpgqj8xq64k.code.run/api/ephoto/dragonfire?text=${name}`;
      message = "here's the [ DRAGON FIRE ] Logo created:";
      break;
    case "bulb":
      apiUrl = `https://site--faaheem--hzpgqj8xq64k.code.run/api/ephoto/incandescent?text=${name}`;
      message = "here's the [ BULB ] Logo created:";
      break;
    case "typography":
      apiUrl = `https://site--faaheem--hzpgqj8xq64k.code.run/api/ephoto/typography2?text=${name}`;
      message = "here's the [ TYPOGRAPHY ] Logo created:";
      break;
    case "leaves":
      apiUrl = `https://site--faaheem--hzpgqj8xq64k.code.run/api/ephoto/letters?text=${name}`;
      message = "here's the [ LEAVES ] Logo created:";
      break;
    case "cloth":
      apiUrl = `https://site--faaheem--hzpgqj8xq64k.code.run/api/ephoto/cloth?text=${name}`;
      message = "here's the [ CLOTH ] Logo created:";
      break;
    case "graffiti":
      apiUrl = `https://site--faaheem--hzpgqj8xq64k.code.run/api/ephoto/graffiti?text=${name}`;
      message = "here's the [ GRAFFITI ] Logo created:";
      break;
    case "star":
      apiUrl = `https://site--faaheem--hzpgqj8xq64k.code.run/api/ephoto/metals?text=${name}`;
      message = "here's the [ STAR ] Logo created:";
      break;
    case "typography2":
      apiUrl = `https://site--faaheem--hzpgqj8xq64k.code.run/api/ephoto/typography2?text=${name}`;
      message = "here's the [ TYPOGRAPHY 2 ] Logo created:";
      break;
    case "nightstars":
      apiUrl = `https://site--faaheem--hzpgqj8xq64k.code.run/api/ephoto/nightstars?text=${name}`;
      message = "here's the [ NIGHT STARS ] Logo created:";
      break;
    case "cloud":
      apiUrl = `https://site--faaheem--hzpgqj8xq64k.code.run/api/ephoto/cloud?text=${name}`;
      message = "here's the [ CLOUD ] Logo created:";
      break;
    case "papercut":
      apiUrl = `https://site--faaheem--hzpgqj8xq64k.code.run/api/ephoto/caper?text=${name}`;
      message = "here's the [ CUT PAPER ] Logo created:";
      break;
    case "horror":
      apiUrl = `https://site--faaheem--hzpgqj8xq64k.code.run/api/ephoto/horror?text=${name}`;
      message = "here's the [ HORROR ] Logo created:";
      break;
    case "sunlight":
      apiUrl = `https://site--faaheem--hzpgqj8xq64k.code.run/api/ephoto/sunlight?text=${name}`;
      message = "here's the [ sunlight ] Logo created:";
      break;
    case "pig":
      apiUrl = `https://site--faaheem--hzpgqj8xq64k.code.run/api/ephoto/cake?text=${name}`;
      message = "here's the [ PIG ] Logo created:";
      break;
    case "halloween":
      apiUrl = `https://site--faaheem--hzpgqj8xq64k.code.run/api/ephoto/hallowen?text=${name}`;
      message = "here's the [ HALLOWEEN ] Logo created:";
      break;
    case "leafgrafy":
      apiUrl = `https://site--faaheem--hzpgqj8xq64k.code.run/api/ephoto/leafgraphy?text=${name}`;
      message = "here's the [ LEAFGRAFY ] Logo created:";
      break;
    case "water":
      apiUrl = `https://site--faaheem--hzpgqj8xq64k.code.run/api/ephoto/water?text=${name}`;
      message = "here's the [ WATER ] Logo created:";
      break;
    case "puppy":
      apiUrl = `https://site--faaheem--hzpgqj8xq64k.code.run/api/ephoto/puppy?text=${name}`;
      message = "here's the [ PUPPY ] Logo created:";
      break;
    case "foggy":
      apiUrl = `https://site--faaheem--hzpgqj8xq64k.code.run/api/ephoto/foggy?text=${name}`;
      message = "here's the [ FOGGY ] Logo created:";
      break;
    case "heartfire":
      apiUrl = `https://site--faaheem--hzpgqj8xq64k.code.run/api/ephoto/heart?url=https://telegra.ph/file/dec30559fdc855288237d.jpg&text=${name}`;
      message = "here's the [ HEART FIRE] Logo created:";
      break;
    case "fireanimated":
      apiUrl = `https://site--faaheem--hzpgqj8xq64k.code.run/api/ephoto/fire?url=https://telegra.ph/file/dec30559fdc855288237d.jpg&text=${name}`;
      message = "here's the [ FIRE ANIMATED ] Logo created:";
      break;
    case "arrow2":
      apiUrl = `https://html-all-nnhdi.run-us-west2.goorm.site/api/ephoto/arrow2?text=${name}`;
      message = "here's the [ ARROW 2 ] Logo created:";
      break;
    case "teamfight":
      apiUrl = `https://site--faaheem--hzpgqj8xq64k.code.run/api/ephoto/teamfight?text=${name}`;
      message = "here's the [ TEAM FIGHT ] Logo created:";
      break;
    case "avatar":
      apiUrl = `https://site--faaheem--hzpgqj8xq64k.code.run/api/ephoto/legend2?text=${name}`;
      message = "here's the [ LEGEND AVATAR ] Logo created:";
      break;
    case "crossfire":
      apiUrl = `https://site--faaheem--hzpgqj8xq64k.code.run/api/ephoto/crossfire?text=${name}`;
      message = "here's the [ CROSS FIRE  ] Logo created:";
      break;
    case "freefire2":
      apiUrl = `https://site--faaheem--hzpgqj8xq64k.code.run/api/ephoto/freefire2?text=${name}`;
      message = "here's the [ FREE FIRE 🔥] Logo created:";
      break;
    case "icetext":
      apiUrl = `https://site--faaheem--hzpgqj8xq64k.code.run/api/ephoto/icetext?url=https://i.imgur.com/BTPUTRQ.jpg&text=${name}`;
      message = "here's the [ ICE 🧊 ] Logo created:";
      break;
    case "blood":
      apiUrl = `https://site--faaheem--hzpgqj8xq64k.code.run/api/ephoto/blood?url=https://i.imgur.com/BTPUTRQ.jpg&text=${name}`;
      message = "here's the [ BLOOD ] Logo created:";
      break;
    case "blood2":
      apiUrl = `https://site--faaheem--hzpgqj8xq64k.code.run/api/ephoto/blood2?url=https://i.imgur.com/BTPUTRQ.jpg&text=${name}`;
      message = "here's the [ BLOOD 2 ] Logo created:";
      break;
    case "tatto":
      apiUrl = `https://site--faaheem--hzpgqj8xq64k.code.run/api/ephoto/tatto?text=${name}`;
      message = "here's the [  TATTO  ] Logo created:";
      break;
    case "flaming":
      apiUrl = `https://site--faaheem--hzpgqj8xq64k.code.run/api/ephoto/flaming?url=https://i.imgur.com/BTPUTRQ.jpg&text=${name}`;
      message = "here's the [ FLAMING ] Logo created:";
      break;
    case "mobigame":
      apiUrl = `https://site--faaheem--hzpgqj8xq64k.code.run/api/ephoto/mobilegame?text=${name}`;
      message = "here's the [ GAMING ] Logo created:";
      break;
    case "wing":
      apiUrl = `https://site--faaheem--hzpgqj8xq64k.code.run/api/ephoto/winggif?text=${name}&url=https://i.imgur.com/BTPUTRQ.jpg`;
      message = "here's the [ WINGS ] Logo created:";
      break;
    case "lovecard":
      apiUrl = `https://site--faaheem--hzpgqj8xq64k.code.run/api/ephoto/lovecard?url=https://i.imgur.com/BTPUTRQ.jpg&text=${name}`;
      message = "here's the [ LOVE CARD] Logo created:";
      break;
    case "queen":
      apiUrl = `https://site--faaheem--hzpgqj8xq64k.code.run/api/ephoto/queen?text=${name}`;
      message = "here's the [ QUEEN 👸] Logo created:";
      break;
    case "gamergirl":
      apiUrl = `https://site--faaheem--hzpgqj8xq64k.code.run/api/ephoto/gamergirl?text=${name}`;
      message = "here's the [ GAMER GIRL  ] Logo created:";
      break;
    case "avohero":
      apiUrl = `https://site--faaheem--hzpgqj8xq64k.code.run/api/ephoto/aov?text=${name}`;
      message = "here's the [ HERO ] Logo created:";
      break;
    case "beach":
      apiUrl = `https://site--faaheem--hzpgqj8xq64k.code.run/api/ephoto/beach?text=${name}`;
      message = "here's the [ BEACH LOGO ] Logo created:";
      break;
    case "lolavater":
      apiUrl = `https://site--faaheem--hzpgqj8xq64k.code.run/api/ephoto/lolnew?text=${name}`;
      message = "here's the [ LOL AVATR ] Logo created:";
      break;
    case "dotalogo":
      apiUrl = `https://site--faaheem--hzpgqj8xq64k.code.run/api/ephoto/dota?text=${name}`;
      message = "here's the [ DOTA LOGO ] Logo created:";
      break;
    case "king":
      apiUrl = `https://site--faaheem--hzpgqj8xq64k.code.run/api/ephoto/king2?text=${name}`;
      message = "here's the [ KING ] Logo created:";
      break;
    case "goldavatar":
      apiUrl = `https://site--faaheem--hzpgqj8xq64k.code.run/api/ephoto/goldavatar?text=${name}`;
      message = "here's the [ GOLD AVATAR ] Logo created:";
      break;
    case "team2":
      apiUrl = `https://site--faaheem--hzpgqj8xq64k.code.run/api/ephoto/team2?text=${name}`;
      message = "here's the [ TEAM 2 ] Logo created:";
      break;
    case "shield":
      apiUrl = `https://site--faaheem--hzpgqj8xq64k.code.run/api/ephoto/sheild?text=${name}`;
      message = "here's the [ SHIELD ] Logo created:";
      break;
    case "galaxy":
      apiUrl = `https://site--faaheem--hzpgqj8xq64k.code.run/api/ephoto/galaxy?text=${name}`;
      message = "here's the [ GALAXY ] Logo created:";
      break;
    case "arena":
      apiUrl = `https://site--faaheem--hzpgqj8xq64k.code.run/api/ephoto/arena?text=${name}`;
      message = "here's the [ ARENA  ] Logo created:";
      break;
    case "arenarank":
      apiUrl = `https://site--faaheem--hzpgqj8xq64k.code.run/api/ephoto/rank?text=${name}`;
      message = "here's the [ ARENA RANK  ] Logo created:";
      break;
    case "neon":
      apiUrl = `https://site--faaheem--hzpgqj8xq64k.code.run/api/ephoto/neonstyle?text=${name}`;
      message = "here's the [ NEON ] Logo created:";
      break;
    case "pubg2":
      apiUrl = `https://site--faaheem--hzpgqj8xq64k.code.run/api/ephoto/pubg2?text=${name}`;
      message = "here's the [ PUBG 2 ] Logo created:";
      break;
    case "pubg3":
      apiUrl = `https://site--faaheem--hzpgqj8xq64k.code.run/api/ephoto/pubg3?text=${name}`;
      message = "here's the [ PUBG 3 ] Logo created:";
      break;
    case "fbcover":
      apiUrl = `https://site--faaheem--hzpgqj8xq64k.code.run/api/ephoto/facebookcover?text=${name}`;
      message = "here's the [ FBCOVER ] Logo created:";
      break;
    case "fbcover2":
      apiUrl = `https://site--faaheem--hzpgqj8xq64k.code.run/api/ephoto/facebookcover2?text=${name}`;
      message = "here's the [ FBCOVER 2 ] Logo created:";
      break;
    case "fbcover3":
      apiUrl = `https://site--faaheem--hzpgqj8xq64k.code.run/api/ephoto/facebookcover3?text=${name}`;
      message = "here's the [ FBCOVER 3 ] Logo created:";
      break;
    case "fbcover4":
      apiUrl = `https://site--faaheem--hzpgqj8xq64k.code.run/api/ephoto/facebookcover4?text=${name}`;
      message = "here's the [ FBCOVER 4 ] Logo created:";
      break;
    case "fbcover5":
      apiUrl = `https://site--faaheem--hzpgqj8xq64k.code.run/api/ephoto/facebookcover5?text=${name}`;
      message = "here's the [ FBCOVER 5 ] Logo created:";
      break;
    case "fbcover6":
      apiUrl = `https://site--faaheem--hzpgqj8xq64k.code.run/api/ephoto/facebookcover6?text=${name}`;
      message = "here's the [ FBCOVER 6 ] Logo created:";
      break;
    case "fbcover7":
      apiUrl = `https://site--faaheem--hzpgqj8xq64k.code.run/api/ephoto/facebookcover7?text=${name}`;
      message = "here's the [ FBCOVER 7 ] Logo created:";
      break;
    case "fbcover8":
      apiUrl = `https://site--faaheem--hzpgqj8xq64k.code.run/api/ephoto/facebookcover8?text=${name}`;
      message = "here's the [ FBCOVER 8 ] Logo created:";
      break;
    case "notebook":
      apiUrl = `https://site--faaheem--hzpgqj8xq64k.code.run/api/ephoto/notebook?url=https://telegra.ph/file/dec30559fdc855288237d.jpg&text=${name}&text2=Yout%20in%20the%20worM`;
      message = "here's the [ NOOT BOOK MUSIC  ] Logo created:";
      break;
    case "wanted":
      apiUrl = `https://site--faaheem--hzpgqj8xq64k.code.run/api/ephoto/wposter?url=https://telegra.ph/file/dec30559fdc855288237d.jpg&text=${name}&text2=ApM`;
      message = "here's the [ WANTED POSTER  ] Logo created:";
      break;
    case "arrowtatto":
      apiUrl = `https://site--faaheem--hzpgqj8xq64k.code.run/api/ephoto/arrow?text=${name}`;
      message = "here's the [ ARROW TATTOO ] Logo created:";
      break;
    case "arrowtatto2":
      apiUrl = `https://site--faaheem--hzpgqj8xq64k.code.run/api/ephoto/arrow2?text=${name}`;
      message = "here's the [ ARROW TATTO 2 ] Logo created:";
      break;
    case "hacker":
      apiUrl = `https://site--faaheem--hzpgqj8xq64k.code.run/api/ephoto/anonymous?text=${name}`;
      message = "here's the [ HACKER ] Logo created:";
      break;
    case "lovecard2":
      apiUrl = `https://site--faaheem--hzpgqj8xq64k.code.run/api/ephoto/lovecard2?url=https://i.imgur.com/BTPUTRQ.jpg&text=${name}`;
      message = "here's the [ LOVE CARD 2 ] Logo created:";
      break;
    case "lovecard3":
      apiUrl = `https://site--faaheem--hzpgqj8xq64k.code.run/api/ephoto/lovecard3?url=https://i.imgur.com/BTPUTRQ.jpg&text=${name}`;
      message = "here's the [ LOVE CARD 3 ] Logo created:";
      break;
    case "heartwing":
      apiUrl = `https://html-all-nnhdi.run-us-west2.goorm.site/api/ephoto/winggif?url=https://i.imgur.com/BTPUTRQ.jpg&text=${name}`;
      message = "here's the [ HEART WING ] Logo created:";
      break;
    case "cake":
      apiUrl = `https://html-all-nnhdi.run-us-west2.goorm.site/api/ephoto/cake2?url=https://i.imgur.com/BTPUTRQ.jpg&text=${name}`;
      message = "here's the [ CAKE ] Logo created:";
      break;
    case "cake2":
      apiUrl = `https://site--faaheem--hzpgqj8xq64k.code.run/api/ephoto/cake2?url=https://i.imgur.com/BTPUTRQ.jpg&text=${name}`;
      message = "here's the [ CAKE 2 ] Logo created:";
      break;
    case "cake3":
      apiUrl = `https://site--faaheem--hzpgqj8xq64k.code.run/api/ephoto/cake3?url=https://i.imgur.com/BTPUTRQ.jpg&text=${name}`;
      message = "here's the [ CAKE 3 ] Logo created:";
      break;
    case "cake4":
      apiUrl = `https://site--faaheem--hzpgqj8xq64k.code.run/api/ephoto/cake4?url=https://i.imgur.com/BTPUTRQ.jpg&text=${name}`;
      message = "here's the [ CAKE 4 ] Logo created:";
      break;
    case "cake5":
      apiUrl = `https://site--faaheem--hzpgqj8xq64k.code.run/api/ephoto/cake5?url=https://i.imgur.com/BTPUTRQ.jpg&text=${name}`;
      message = "here's the [ CAKE 5 ] Logo created:";
      break;
    case "cake6":
      apiUrl = `https://site--faaheem--hzpgqj8xq64k.code.run/api/ephoto/cake6?url=https://i.imgur.com/BTPUTRQ.jpg&text=${name}`;
      message = "here's the [ CAKE 6 ] Logo created:";
      break;
    case "cup":
      apiUrl = `https://site--faaheem--hzpgqj8xq64k.code.run/api/ephoto/cup?text=${name}&url=https://i.imgur.com/BTPUTRQ.jpg`;
      message = "here's the [ CUP ] Logo created:";
      break;
    case "baloon":
      apiUrl = `https://site--faaheem--hzpgqj8xq64k.code.run/api/ephoto/loveballon?url=https://i.imgur.com/BTPUTRQ.jpg&text=${name}`;
      message = "here's the [ BALLOON ] Logo created:";
      break;
    case "city":
      apiUrl = `https://site--faaheem--hzpgqj8xq64k.code.run/api/ephoto/cyberpunk?url=https://telegra.ph/file/dec30559fdc855288237d.jpg&text=${name}`;
      message = "here's the [  CYBER PUNK CITY ] Logo created:";
      break;
    case "wanted2":
      apiUrl = `https://site--faaheem--hzpgqj8xq64k.code.run/api/ephoto/wanted2?text=${name}&url=https://i.imgur.com/BTPUTRQ.png`;
      message = "here's the [ WANTED 2 ] Logo created:";
      break;
    case "sadmood":
      apiUrl = `https://site--faaheem--hzpgqj8xq64k.code.run/api/ephoto/sad?url=https://telegra.ph/file/dec30559fdc855288237d.jpg&text=${name}`;
      message = "here's the [ SAD MOOD  ] Logo created:";
      break;
    case "lovebaloon":
      apiUrl = `https://site--faaheem--hzpgqj8xq64k.code.run/api/ephoto/loveballon?text=${name}`;
      message = "here's the [ LOVE BALOON ] Logo created:";
      break;
    case "birthdaycard":
      apiUrl = `https://site--faaheem--hzpgqj8xq64k.code.run/api/ephoto/birthdaycard?url=https://i.imgur.com/BTPUTRQ.jpg&text=${name}`;
      message = "here's the [ BIRTHDAY CARD ♠️ ] Logo created:";
      break;
    case "exposure":
      apiUrl = `https://site--faaheem--hzpgqj8xq64k.code.run/api/ephoto/doubleexpouser?text=${name}`;
      message = "here's the [ EXPOSURE ] Logo created:";
      break;
    default:
      return api.sendMessage(
        `Invalid logo type! Use .Ephoto list 1 to see the list of Ephoto logos.`,
        threadID,
        messageID
      );
  }

  api.sendMessage(
    "Processing your Ephoto logo, please wait...",
    threadID,
    messageID
  );
  
  try {
    let response = await axios.get(apiUrl, { responseType: "arraybuffer" });
    let logo = response.data;
    fs.writeFileSync(pathImg, Buffer.from(logo, "utf-8"));
    return api.sendMessage(
      {
        body: message,
        attachment: fs.createReadStream(pathImg),
      },
      threadID,
      () => fs.unlinkSync(pathImg),
      messageID
    );
  } catch (error) {
    return api.sendMessage(
      `Error generating logo: ${error.message}`,
      threadID,
      messageID
    );
  }
};
