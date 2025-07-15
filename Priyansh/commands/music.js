const axios = require("axios");
const fs = require("fs");
const path = require("path");

function deleteAfterTimeout(filePath, timeout = 60000) {
  setTimeout(() => {
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (!err) console.log(`🧹 Deleted file: ${filePath}`);
      });
    }
  }, timeout);
}

function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatDuration(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
}

module.exports = {
  config: {
    name: "music",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "Mirrykal (fixed by ChatGPT)",
    description: "Download YouTube audio/video by query",
    commandCategory: "Media",
    usages: "music <query> | music video <query>",
    cooldowns: 5,
  },

  run: async function ({ api, event, args }) {
    if (!args[0]) return api.sendMessage("🎵 Gana ka naam to likho! 😐", event.threadID);

    const isVideo = args[0].toLowerCase() === "video";
    const query = isVideo ? args.slice(1).join(" ") : args.join(" ");
    await api.sendMessage(`🔍 "${query}" dhoondh raha hoon...`, event.threadID);

    try {
      // YouTube search
      const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&maxResults=1&type=video&key=AIzaSyAGQrBQYworsR7T2gu0nYhLPSsi2WFVrgQ`;
      const searchRes = await axios.get(searchUrl);

      if (!searchRes.data.items.length) throw new Error("❌ Gana nahi mila.");

      const video = searchRes.data.items[0];
      const videoId = video.id.videoId;
      const videoUrl = `https://youtu.be/${videoId}`;

      // API call for download link
      const apiUrl = isVideo
        ? `https://vihangayt.me/download/ytmp4?url=${videoUrl}`
        : `https://vihangayt.me/download/ytmp3?url=${videoUrl}`;

      const dataRes = await axios.get(apiUrl);

      if (!dataRes.data?.data?.url) throw new Error("❌ Download URL nahi mila.");

      const {
        title = query,
        url: downloadUrl,
        thumb: thumbnail,
        duration = 0,
        views = 0,
        channel = { name: "Unknown" }
      } = dataRes.data.data;

      // Check file size limit
      const headCheck = await axios.head(downloadUrl).catch(() => null);
      const maxSize = 25 * 1024 * 1024; // 25MB

      if (headCheck && parseInt(headCheck.headers["content-length"]) > maxSize) {
        throw new Error("❌ File size limit exceed kar gaya (25MB se zyada).");
      }

      // Download thumbnail
      const thumbExt = thumbnail.endsWith(".png") ? "png" : "jpg";
      const thumbPath = path.join(__dirname, "cache", `${videoId}.${thumbExt}`);
      const thumbStream = fs.createWriteStream(thumbPath);
      const thumbDownload = await axios({ url: thumbnail, responseType: "stream" });

      await new Promise((resolve, reject) => {
        thumbDownload.data.pipe(thumbStream);
        thumbStream.on("finish", resolve);
        thumbStream.on("error", reject);
      });

      // Send info message
      await api.sendMessage({
        body:
          `🎵 ${isVideo ? "🎥 Video" : "🎧 Audio"} Info:\n\n` +
          `📌 Title: ${title}\n` +
          `📺 Channel: ${channel.name}\n` +
          `👁️ Views: ${formatNumber(views)}\n` +
          `⏱️ Duration: ${formatDuration(duration)}\n\n` +
          `🔗 ${videoUrl}`,
        attachment: fs.createReadStream(thumbPath),
      }, event.threadID, () => deleteAfterTimeout(thumbPath), event.messageID);

      // Download media
      const format = isVideo ? "mp4" : "mp3";
      const safeTitle = title.replace(/[^\w\s]/gi, "_").slice(0, 30);
      const filePath = path.join(__dirname, "cache", `${safeTitle}.${format}`);
      const fileStream = fs.createWriteStream(filePath);

      const mediaRes = await axios({
        url: downloadUrl,
        method: "GET",
        responseType: "stream",
        timeout: 60000,
      });

      mediaRes.data.pipe(fileStream);

      await new Promise((resolve, reject) => {
        fileStream.on("finish", resolve);
        fileStream.on("error", reject);
      });

      api.setMessageReaction("✅", event.messageID, () => {}, true);

      await api.sendMessage({
        attachment: fs.createReadStream(filePath),
      }, event.threadID, event.messageID);

      deleteAfterTimeout(filePath, 60000);

    } catch (err) {
      console.error("⛔ Error:", err.message);
      api.sendMessage(`❌ Error: ${err.message}`, event.threadID, event.messageID);
    }
  },
};
