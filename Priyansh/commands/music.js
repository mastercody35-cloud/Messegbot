const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { ytsearch, ytmp3 } = require("ruhend-scraper");
const { Downloader } = require("abot-scraper");

const downloader = new Downloader();

module.exports.config = {
  name: "song",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "Mian Amir",
  description: "Download YouTube audio or video",
  commandCategory: "media",
  usages: "[song name] [optional: video]",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  if (!args[0]) {
    return api.sendMessage("❌ Please type a song name.\n\nExample: .song tum hi ho\nOr: .song tum hi ho video", event.threadID, event.messageID);
  }

  const isVideo = args[args.length - 1].toLowerCase() === "video";
  const query = isVideo ? args.slice(0, -1).join(" ") : args.join(" ");
  const waitMsg = await api.sendMessage(`🔍 Searching: ${query} (${isVideo ? "video" : "audio"})...`, event.threadID);

  try {
    const { video } = await ytsearch(query);
    if (!video || video.length === 0) {
      return api.sendMessage("❌ No result found.", event.threadID, event.messageID);
    }

    const selected = video[0];
    const safeTitle = selected.title.replace(/[^a-z0-9]/gi, "_").toLowerCase();
    const fileName = isVideo ? `${safeTitle}.mp4` : `${safeTitle}.mp3`;
    const filePath = path.join(__dirname, fileName);

    let downloadUrl = null;

    if (isVideo) {
      const res = await downloader.youtubeDownloader(selected.url);
      if (!res || res.status !== 200 || !res.result?.video) {
        return api.sendMessage("❌ Failed to fetch video URL.", event.threadID, event.messageID);
      }
      downloadUrl = res.result.video;
    } else {
      const { title, audio } = await ytmp3(selected.url);
      if (!audio || !audio.startsWith("http")) {
        return api.sendMessage("❌ Failed to fetch MP3 link.", event.threadID, event.messageID);
      }
      downloadUrl = audio;
    }

    const response = await axios({
      method: "GET",
      url: downloadUrl,
      responseType: "stream"
    });

    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    writer.on("finish", async () => {
      await api.sendMessage({
        body: `🎶 Title: ${selected.title}\n✅ Here's your ${isVideo ? "video" : "song"}:`,
        attachment: fs.createReadStream(filePath)
      }, event.threadID, () => {
        fs.unlinkSync(filePath);
        api.unsendMessage(waitMsg.messageID);
      }, event.messageID);
    });

    writer.on("error", (err) => {
      console.error("❌ Write error:", err);
      api.sendMessage("❌ Failed to save the file.", event.threadID, event.messageID);
    });

  } catch (err) {
    console.error("❌ Main error:", err.message);
    api.sendMessage("❌ Error occurred while processing your request.", event.threadID, event.messageID);
  }
};
