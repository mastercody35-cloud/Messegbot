module.exports.config = {
  name: "approve",
  version: "1.0.2",
  hasPermssion: 2,
  credits: "Fixed by Talha",
  description: "Approve or manage group access to the bot",
  commandCategory: "Admin",
  cooldowns: 5
};

const fs = require("fs");
const path = require("path");

// Create necessary directories if they don't exist
const priyanshuDir = path.join(__dirname, "Priyanshu");
if (!fs.existsSync(priyanshuDir)) {
  fs.mkdirSync(priyanshuDir);
}

const cacheDir = path.join(__dirname, "cache");
if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir);
}

const dataPath = path.join(priyanshuDir, "approvedThreads.json");
const dataPending = path.join(priyanshuDir, "pendingThreads.json");
const gifPath = path.join(cacheDir, "approved_by_talha.gif");

module.exports.onLoad = () => {
  // Initialize files if they don't exist
  if (!fs.existsSync(dataPath)) fs.writeFileSync(dataPath, JSON.stringify([]));
  if (!fs.existsSync(dataPending)) fs.writeFileSync(dataPending, JSON.stringify([]));
  
  // You need to provide the actual GIF file or URL here
  // This is just a placeholder - replace with your actual GIF path or download logic
  if (!fs.existsSync(gifPath)) {
    // You would need to either:
    // 1. Have the GIF file in your project directory and copy it
    // 2. Download it from a URL
    // Example for option 1:
    const sourceGif = path.join(__dirname, "assets", "talha_approval.gif");
    if (fs.existsSync(sourceGif)) {
      fs.copyFileSync(sourceGif, gifPath);
    }
  }
};

module.exports.run = async ({ event, api, args, Threads, handleReply, Users }) => {
  const { threadID, messageID, senderID } = event;
  const { sendMessage, getThreadInfo } = api;

  let data = JSON.parse(fs.readFileSync(dataPath));
  let dataP = JSON.parse(fs.readFileSync(dataPending));
  let idBox = args[1] || threadID;

  try {
    switch (args[0]?.toLowerCase()) {
      case "list":
      case "l": {
        if (data.length === 0) {
          return sendMessage("ℹ️ No groups are currently approved.", threadID, messageID);
        }
        
        let msg = `✅ Approved Groups List [${data.length}]:\n\n`;
        for (let i = 0; i < data.length; i++) {
          try {
            const info = await getThreadInfo(data[i]);
            msg += `${i+1}. ${info.threadName || "Unknown Group"}\nID: ${data[i]}\n\n`;
          } catch (e) {
            msg += `${i+1}. [Couldn't fetch group info]\nID: ${data[i]}\n\n`;
          }
        }
        return sendMessage(msg, threadID, messageID);
      }

      case "pending":
      case "p": {
        if (dataP.length === 0) {
          return sendMessage("ℹ️ No groups are currently pending approval.", threadID, messageID);
        }
        
        let msg = `⌛ Pending Approvals [${dataP.length}]:\n\n`;
        for (let i = 0; i < dataP.length; i++) {
          try {
            const info = await getThreadInfo(dataP[i]);
            msg += `${i+1}. ${info.threadName || "Unknown Group"}\nID: ${dataP[i]}\n\n`;
          } catch (e) {
            msg += `${i+1}. [Couldn't fetch group info]\nID: ${dataP[i]}\n\n`;
          }
        }
        return sendMessage(msg, threadID, messageID);
      }

      case "help":
      case "h": {
        const prefix = global.config.PREFIX;
        return sendMessage(
          `🛠️ APPROVE COMMAND HELP:\n\n` +
          `${prefix}approve list/l → View approved groups\n` +
          `${prefix}approve pending/p → View pending approvals\n` +
          `${prefix}approve del/d <ID> → Remove approval\n` +
          `${prefix}approve <ID> → Approve group\n\n` +
          `👑 Owner: Talha Pathan`,
          threadID,
          messageID
        );
      }

      case "del":
      case "d": {
        if (!data.includes(idBox)) {
          return sendMessage("❌ This group is not approved!", threadID, messageID);
        }
        data = data.filter(e => e !== idBox);
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
        return sendMessage("✅ Group removed from approved list.", threadID, messageID);
      }

      default: {
        if (isNaN(idBox)) {
          return sendMessage("❗ Invalid group ID. Please provide a numeric ID.", threadID, messageID);
        }
        if (data.includes(idBox)) {
          return sendMessage("⚠️ This group is already approved.", threadID, messageID);
        }

        // Approve the group
        data.push(idBox);
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
        
        // Remove from pending if exists
        if (dataP.includes(idBox)) {
          dataP = dataP.filter(e => e !== idBox);
          fs.writeFileSync(dataPending, JSON.stringify(dataP, null, 2));
        }

        // Try to send the approval message with GIF
        try {
          const message = {
            body: `🌺 𝐌𝐎𝐓𝐎 𝐁𝐎𝐓 🦋🌺 𝐂𝐎𝐍𝐍𝐄𝐂𝐓𝐄𝐃\n\n` +
                  `╔═══✿🌸✿═══╗\n` +
                  `✨ 𝐁𝐎𝐓 𝐌𝐀𝐃𝐄 𝐁𝐘 𝐓𝐀𝐋𝐇𝐀 𝐏𝐀𝐓𝐇𝐀𝐍 ✨\n` +
                  `╚═══✿🌸✿═══╝\n\n` +
                  `💖 𝐁𝐎𝐓 𝐂𝐎𝐍𝐍𝐄𝐂𝐓𝐄𝐃 𝐒𝐔𝐂𝐂𝐄𝐒𝐒𝐅𝐔𝐋𝐋𝐘 💖\n\n` +
                  `🥀 𝐀𝐏𝐊𝐄 𝐆𝐑𝐎𝐔𝐏 𝐊𝐎 𝐌𝐄𝐑𝐄 𝐁𝐎𝐒𝐒 𝐓𝐀𝐋𝐇𝐀 𝐏𝐀𝐓𝐇𝐀𝐍 𝐍𝐄 𝐀𝐏𝐏𝐑𝐎𝐕𝐄 𝐊𝐀𝐑 𝐃𝐈𝐘𝐀 𝐇𝐀𝐈 🥀\n\n` +
                  `────────────────────────────\n\n` +
                  `💬 𝐌𝐄𝐑𝐄 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐒 𝐃𝐄𝐊𝐇𝐍𝐄 𝐊𝐄 𝐋𝐈𝐘𝐄 "𝐡𝐞𝐥𝐩" 𝐊𝐀 𝐔𝐒𝐄 𝐊𝐈𝐉𝐈𝐘𝐄\n\n` +
                  `🔰 Commands Example:\n` +
                  `╭─────────────\n` +
                  `│ 🎶 #music – Audio Songs\n` +
                  `│ 📹 #video – Video Songs\n` +
                  `│ 🛠️ #help – All Commands\n` +
                  `│ ℹ️ #info – Bot Info\n` +
                  `╰─────────────\n\n` +
                  `────────────────────────────\n\n` +
                  `📩 𝐂𝐎𝐍𝐓𝐀𝐂𝐓 𝐅𝐎𝐑 𝐇𝐄𝐋𝐏:\n` +
                  `👑 𝐎𝐖𝐍𝐄𝐑: 𝐓𝐀𝐋𝐇𝐀 𝐏𝐀𝐓𝐇𝐀𝐍\n\n` +
                  `🔗 𝐅𝐀𝐂𝐄𝐁𝐎𝐎𝐊: \n` +
                  `https://www.facebook.com/share/193GypVyJQ/\n\n` +
                  `💝 𝐌𝐄𝐑𝐄 𝐁𝐎𝐒𝐒 𝐓𝐀𝐋𝐇𝐀 𝐍𝐄 𝐌𝐔𝐉𝐇𝐄 𝐁𝐀𝐍𝐀𝐘𝐀 𝐇𝐀𝐈 💝`,
            attachment: fs.existsSync(gifPath) ? fs.createReadStream(gifPath) : undefined
          };
          
          await sendMessage(message, idBox);
          return sendMessage(`✅ Successfully approved group ${idBox}`, threadID, messageID);
        } catch (e) {
          console.error(e);
          return sendMessage(`✅ Group ${idBox} approved, but could not send message to the group.`, threadID, messageID);
        }
      }
    }
  } catch (error) {
    console.error(error);
    return sendMessage("❌ An error occurred while processing your request.", threadID, messageID);
  }
};
