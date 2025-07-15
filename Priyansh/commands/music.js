const ytdlp = require('yt-dlp-exec');
const fs = require('fs');
const path = require('path');

function deleteAfterTimeout(filePath, timeout = 60000) {
  setTimeout(() => {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }, timeout);
}

function formatDuration(s) {
  let m = Math.floor(s / 60), sec = s % 60;
  return `${m}m ${sec}s`;
}

module.exports = {
  config: {
    name: "music",
    version: "2.1.0",
    hasPermssion: 0,
    credits: "Mirrykal + ChatGPT",
    description: "Download YouTube audio/video by query (unlimited)",
    commandCategory: "Media",
    usages: "music <query> | music video <query>",
    cooldowns: 5,
  },

  run: async function ({ api, event, args }) {
    if (!args[0]) return api.sendMessage("🎵 Gana ka naam likho!", event.threadID);

    const isVideo = args[0].toLowerCase() === 'video';
    const query = isVideo ? args.slice(1).join(' ') : args.join(' ');

    await api.sendMessage(`🔍 "${query}" dhoondh raha hoon...`, event.threadID);

    try {
      const info = await ytdlp(query, {
        dumpSingleJson: true,
        noWarnings: true,
        noCallHome: true,
        noCheckCertificate: true,
        preferFreeFormats: true,
        format: isVideo ? 'best[ext=mp4][height<=480]' : 'bestaudio[ext=m4a]/bestaudio'
      });

      const downloadUrl = info.url;
      const title = info.title || 'audio';
      const duration = info.duration || 0;
      const author = info.uploader || 'Unknown';
      const videoUrl = info.webpage_url;
      const thumbnail = info.thumbnail;

      // Send thumbnail with info
      const thumbPath = path.join(__dirname, 'cache', `${Date.now()}_thumb.jpg`);
      const thumb = await ytdlp.exec(thumbnail, { output: thumbPath });
      await api.sendMessage({
        body:
          `🎵 ${isVideo ? '🎥 Video' : '🎧 Audio'} Info:\n\n` +
          `📌 Title: ${title}\n` +
          `👤 Channel: ${author}\n` +
          `⏱️ Duration: ${formatDuration(duration)}\n` +
          `🔗 ${videoUrl}`,
        attachment: fs.createReadStream(thumbPath)
      }, event.threadID, () => deleteAfterTimeout(thumbPath), event.messageID);

      // Download media
      const ext = isVideo ? 'mp4' : 'm4a';
      const safeTitle = title.replace(/[^\w\s]/gi, '_').slice(0, 30);
      const filePath = path.join(__dirname, 'cache', `${safeTitle}.${ext}`);

      await ytdlp.exec(query, {
        output: filePath,
        format: isVideo ? 'best[ext=mp4][height<=480]' : 'bestaudio[ext=m4a]/bestaudio'
      });

      await api.sendMessage({
        body: `✅ Lo bhai, ${isVideo ? 'video' : 'audio'} mil gaya!`,
        attachment: fs.createReadStream(filePath)
      }, event.threadID, () => deleteAfterTimeout(filePath), event.messageID);

    } catch (e) {
      console.error(e);
      return api.sendMessage(`❌ Error: ${e.message}`, event.threadID);
    }
  }
};
