const axios = require("axios");
const fs = require("fs");
const path = require("path");

function deleteAfterTimeout(filePath, timeout = 60000) {
  setTimeout(() => {
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (!err) console.log(`🧹 Deleted: ${filePath}`);
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
    credits: "Updated by ChatGPT",
    description: "Download YouTube audio/video using stable API",
    commandCategory: "media",
    usages: "music <query> | music video <query>",
    cooldowns: 5,
  },

  run: async function ({ api, event, args }) {
    if (!args[0]) return api.sendMessage("🎵 Gana ka naam to likho! 😐", event.threadID);

    const isVideo = args[0].toLowerCase() === "video";
    const query = isVideo ? args.slice(1).join(" ") : args.join(" ");
    const searchKey = encodeURIComponent(query);

    const YT_API_KEY = "AIzaSyAGQrBQYworsR7T2gu0nYhLPSsi2WFVrgQ"; // working but limited quota
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchKey}&maxResults=1&type=video&key=${YT_API_KEY}`;

    try {
      const searchRes = await axios.get(searchUrl);
      if (!searchRes.data.items.length) throw new Error("❌ Gana nahi mila.");

      const video = searchRes.data.items[0];
      const videoId = video.id.videoId;
      const videoUrl = `https://youtu.be/${videoId}`;

      const title = video.snippet.title;
      const thumbnail = video.snippet.thumbnails.high.url;
      const channel = video.snippet.channelTitle;

      // Save thumbnail
      const thumbExt = thumbnail.endsWith(".png") ? "png" : "jpg";
      const thumbPath = path.join(__dirname, "cache", `${videoId}.${thumbExt}`);
      const thumbStream = fs.createWriteStream(thumbPath);
      const thumbImg = await axios({ url: thumbnail, responseType: "stream" });

      await new Promise((resolve, reject) => {
        thumbImg.data.pipe(thumbStream);
        thumbStream.on("finish", resolve);
        thumbStream.on("error", reject);
      });

      await api.sendMessage({
        body:
          `🎵 ${isVideo ? "🎥 Video" : "🎧 Audio"} Info:\n\n` +
          `📌 Title: ${title}\n` +
          `📺 Channel: ${channel}\n` +
          `🔗 Link: ${videoUrl}`,
        attachment: fs.createReadStream(thumbPath),
      }, event.threadID, () => deleteAfterTimeout(thumbPath), event.messageID);

      // Download media from new API
      const apiUrl = isVideo
        ? `https://youtube-download-api.matheusishiyama.repl.co/mp4/?url=${encodeURIComponent(videoUrl)}`
        : `https://youtube-download-api.matheusishiyama.repl.co/mp3/?url=${encodeURIComponent(videoUrl)}`;

      const fileExt = isVideo ? "mp4" : "mp3";
      const safeTitle = title.replace(/[^\w\s]/gi, "_").slice(0, 30);
      const filePath = path.join(__dirname, "cache", `${safeTitle}.${fileExt}`);
      const fileStream = fs.createWriteStream(filePath);

      const mediaRes = await axios({
        url: apiUrl,
        method: "GET",
        responseType: "stream",
        timeout: 60000
      });

      mediaRes.data.pipe(fileStream);
      await new Promise((resolve, reject) => {
        fileStream.on("finish", resolve);
        fileStream.on("error", reject);
      });

      await api.sendMessage({
        attachment: fs.createReadStream(filePath),
      }, event.threadID, () => deleteAfterTimeout(filePath), event.messageID);

    } catch (err) {
      console.error(err.message);
      return api.sendMessage(`❌ Error: ${err.message}`, event.threadID, event.messageID);
    }
  },
};
