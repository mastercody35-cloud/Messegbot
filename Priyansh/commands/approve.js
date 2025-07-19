module.exports.config = {
  name: "approve",
  version: "1.0.2",
  hasPermssion: 2,
  credits: "Fix by Talha",
  description: "Approve or manage group access to the bot",
  commandCategory: "Admin",
  cooldowns: 5
};

const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "Priyanshu", "approvedThreads.json");
const dataPending = path.join(__dirname, "Priyanshu", "pendingdThreads.json");
const gifPath = path.join(__dirname, "cache", "approved_by_talha.gif"); // permanent gif path

module.exports.onLoad = () => {
  if (!fs.existsSync(dataPath)) fs.writeFileSync(dataPath, JSON.stringify([]));
  if (!fs.existsSync(dataPending)) fs.writeFileSync(dataPending, JSON.stringify([]));

  // Save Talha GIF permanently (only if not already saved)
  const sourceGif = "/mnt/data/A_GIF_features_neon_text_and_heart_graphics_agains.png";
  if (!fs.existsSync(gifPath) && fs.existsSync(sourceGif)) {
    fs.copyFileSync(sourceGif, gifPath);
  }
};

module.exports.run = async ({ event, api, args, Threads, handleReply, Users }) => {
  const { threadID, messageID, senderID } = event;

  let data = JSON.parse(fs.readFileSync(dataPath));
  let dataP = JSON.parse(fs.readFileSync(dataPending));
  let idBox = args[1] || threadID;

  switch (args[0]?.toLowerCase()) {
    case "list":
    case "l": {
      let msg = `✅ Approved Groups List [${data.length}]:`;
      let count = 1;
      for (const e of data) {
        const info = await api.getThreadInfo(e);
        msg += `\n${count++}. ${info.threadName || await Users.getNameUser(e)}\n🆔 ${e}`;
      }
      return api.sendMessage(msg, threadID, messageID);
    }

    case "pending":
    case "p": {
      let msg = `⌛ Pending Approvals [${dataP.length}]:`;
      let count = 1;
      for (const e of dataP) {
        const info = await api.getThreadInfo(e);
        msg += `\n${count++}. ${info.threadName || await Users.getNameUser(e)}\n🆔 ${e}`;
      }
      return api.sendMessage(msg, threadID, messageID);
    }

    case "help":
    case "h": {
      const prefix = global.config.PREFIX;
      return api.sendMessage(
        `🛠️ APPROVE COMMAND HELP:\n\n${prefix}approve l/list → View approved groups\n${prefix}approve p/pending → View pending\n${prefix}approve d/del <ID> → Remove approval\n${prefix}approve <ID> → Approve group\n\nOWNER: Aadi Babu`,
        threadID,
        messageID
      );
    }

    case "del":
    case "d": {
      if (!data.includes(idBox)) return api.sendMessage("❌ This group is not approved!", threadID, messageID);
      data = data.filter(e => e !== idBox);
      fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
      return api.sendMessage("✅ Group removed from approved list.", threadID, messageID);
    }

    default: {
      if (isNaN(idBox)) return api.sendMessage("❗ Invalid group ID.", threadID, messageID);
      if (data.includes(idBox)) return api.sendMessage("⚠️ This group is already approved.", threadID, messageID);

      // Approve and update JSON
      data.push(idBox);
      fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
      dataP = dataP.filter(e => e !== idBox);
      fs.writeFileSync(dataPending, JSON.stringify(dataP, null, 2));

      // Send message with GIF permanently
      return api.sendMessage({
        body: `🌺 𝐌𝐎𝐓𝐎 𝐁𝐎𝐓 🦋🌺 𝐂𝐎𝐍𝐍𝐄𝐂𝐓𝐄𝐃«

╔═══✿🌸✿═══╗
✨ 𝐁𝐎𝐓 𝐌𝐀𝐃𝐄 𝐁𝐘 𝐓𝐀𝐋𝐇𝐀 𝐏𝐀𝐓𝐇𝐀𝐍 ✨
╚═══✿🌸✿═══╝

💖 𝐁𝐎𝐓 𝐂𝐎𝐍𝐍𝐄𝐂𝐓𝐄𝐃 𝐒𝐔𝐂𝐂𝐄𝐒𝐒𝐅𝐔𝐋𝐋𝐘 💖

🥀 𝐀𝐏𝐊𝐄 𝐆𝐑𝐎𝐔𝐏 𝐊𝐎 𝐌𝐄𝐑𝐄 𝐁𝐎𝐒𝐒 𝐓𝐀𝐋𝐇𝐀 𝐏𝐀𝐓𝐇𝐀𝐍 𝐍𝐄 𝐀𝐏𝐏𝐑𝐎𝐕𝐄 𝐊𝐀𝐑 𝐃𝐈𝐘𝐀 𝐇𝐀𝐈 🥀

────────────────────────────

💬 𝐌𝐄𝐑𝐄 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐃𝐄𝐊𝐇𝐍𝐄 𝐊𝐄 𝐋𝐈𝐘𝐄 "𝐡𝐞𝐥𝐩" 𝐊𝐀 𝐔𝐒𝐄 𝐊𝐈𝐉𝐈𝐘𝐄

🔰 Commands Example:
╭─────────────
│ 🎶 #music – Audio Songs
│ 📹 #video7 – Video Songs
│ 🛠️ #help2 – All Commands
│ ℹ️ #info – Bot Info
╰─────────────

────────────────────────────

📩 𝐂𝐎𝐍𝐓𝐀𝐂𝐓 𝐅𝐎𝐑 𝐇𝐄𝐋𝐏:
👑 𝐎𝐖𝐍𝐄𝐑: 𝐓𝐀𝐋𝐇𝐀 𝐏𝐀𝐓𝐇𝐀𝐍

🔗 𝐅𝐀𝐂𝐄𝐁𝐎𝐎𝐊: 
https://www.facebook.com/share/193GypVyJQ/

📷 𝐈𝐍𝐒𝐓𝐀𝐆𝐑𝐀𝐌: N/A
▶️ 𝐘𝐎𝐔𝐓𝐔𝐁𝐄: N/A

💝 𝐌𝐄𝐑𝐄 𝐁𝐎𝐒𝐒 𝐓𝐀𝐋𝐇𝐀 𝐍𝐄 𝐌𝐔𝐉𝐇𝐄 𝐁𝐀𝐍𝐀𝐘𝐀 𝐇𝐀𝐈 💝`,
        attachment: fs.createReadStream(gifPath)
      }, idBox);
    }
  }
};
