const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const ytdl = require("yt-dlp-exec");
const axios = require("axios");

module.exports = {
  config: {
    name: "music",
    version: "1.1.0",
    hasPermssion: 0,
    credits: "Modified by ChatGPT",
    description: "Download YouTube audio/video by query using yt-dlp",
    commandCategory: "Media",
    usages: "music <query> | music video <query>",
    cooldowns: 5,
  },

  run: async function ({ api, event, args }) {
    const isVideo = args[0] === "video";
    const query = isVideo ? args.slice(1).join(" ") : args.join(" ");
    if (!query) return api.sendMessage("❌ Gana ka naam likho!", event.threadID);

    const waitMsg = await api.sendMessage(`🔎 "${query}" search ho raha hai...`, event.threadID);

    try {
      const search = await ytdl(`ytsearch1:${query}`, {
        dumpSingleJson: true
      });

      const video = search.entries[0];
      const videoUrl = video.webpage_url;
      const title = video.title;
      const fileExt = isVideo ? "mp4" : "mp3";
      const safeTitle = title.replace(/[^\w\s]/gi, "_").slice(0, 30);
      const filePath = path.join(__dirname, "cache", `${safeTitle}.${fileExt}`);

      const thumbPath = path.join(__dirname, "cache", `${safeTitle}.jpg`);
      const thumb = await axios.get(video.thumbnail, { responseType: 'arraybuffer' });
      fs.writeFileSync(thumbPath, Buffer.from(thumb.data, 'binary'));

      await api.sendMessage({
        body:
          `🎧 ${isVideo ? "Video" : "Audio"} Info:\n\n` +
          `📌 Title: ${title}\n` +
          `⏱ Duration: ${video.duration} sec\n` +
          `🔗 Link: ${videoUrl}`,
        attachment: fs.createReadStream(thumbPath),
      }, event.threadID, () => fs.unlinkSync(thumbPath), event.messageID);

      await ytdl(videoUrl, {
        output: filePath,
        format: isVideo ? "mp4[height<=480]" : "bestaudio",
        extractAudio: !isVideo,
        audioFormat: "mp3"
      });

      await api.sendMessage({
        body: `✅ Here's your ${isVideo ? "video" : "audio"}:`,
        attachment: fs.createReadStream(filePath),
      }, event.threadID, () => fs.unlinkSync(filePath), event.messageID);

    } catch (err) {
      console.error(err);
      api.sendMessage(`❌ Error: ${err.message || "Download failed."}`, event.threadID, event.messageID);
    }
  },
};
