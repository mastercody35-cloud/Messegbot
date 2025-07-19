const fs = require("fs");
const path = require("path");

const pendingPath = path.join(__dirname, "..", "commands", "Priyanshu", "pendingdThreads.json");

module.exports.config = {
  event: "log:subscribe", // Trigger when bot joins group
  version: "1.0.1",
  credits: "Talha Modified",
  description: "Auto-pending and notify when bot is added"
};

module.exports.run = async function({ api, event }) {
  const threadID = event.threadID;
  const threadName = (await api.getThreadInfo(threadID)).threadName;

  // Load pending list
  let pending = [];
  if (fs.existsSync(pendingPath)) {
    pending = JSON.parse(fs.readFileSync(pendingPath));
  }

  // Check if already in pending list
  if (!pending.includes(threadID)) {
    pending.push(threadID);
    fs.writeFileSync(pendingPath, JSON.stringify(pending, null, 2));

    // Notify the group
    return api.sendMessage({
      body: `🚫 𝐓𝐡𝐢𝐬 𝐠𝐫𝐨𝐮𝐩 𝐢𝐬 𝐍𝐎𝐓 𝐘𝐄𝐓 𝐀𝐏𝐏𝐑𝐎𝐕𝐄𝐃 ❌

╔═════♡═════╗
🌸 𝐎𝐰𝐧𝐞𝐫 ➤ 𝐓𝐚𝐥𝐡𝐚 𝐏𝐚𝐭𝐡𝐚𝐧 🦋
╚═════♡═════╝

📌 𝐁𝐨𝐭 𝐚𝐩𝐩𝐫𝐨𝐯𝐚𝐥 𝐜𝐡𝐚𝐡𝐢𝐲𝐞 𝐡𝐨 𝐭𝐨 𝐜𝐨𝐧𝐭𝐚𝐜𝐭 𝐎𝐰𝐧𝐞𝐫.

🔐 𝐔𝐬𝐞 ➤ *approve ${threadID}
💌 𝐅𝐁 𝐎𝐰𝐧𝐞𝐫 ➤ https://www.facebook.com/share/193GypVyJQ/`
    }, threadID);
  }
};
