const axios = require("axios");
const ytdl = require("ytdl-core");
const fs = require("fs-extra");
const ytSearch = require("yt-search");
const path = require("path");

module.exports.config = {
  name: "music",
  version: "1.1.0",
  hasPermssion: 0,
  credits: "TalhaGPT",
  description: "Download YouTube audio",
  commandCategory: "media",
  usages: "[song name]",
  cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
  const query = args.join(" ");
  if (!query) return api.sendMessage("🎵 Please provide a song name.", event.threadID);

  const sentMsg = await api.sendMessage("🔍 Searching for your song...", event.threadID);

  try {
    const result = await ytSearch(query);
    const video = result.videos[0];
    if (!video) return api.sendMessage("❌ Song not found.", event.threadID);

    const audioPath = path.join(__dirname, `/cache/music-${event.senderID}.mp3`);
    const stream = ytdl(video.url, { filter: "audioonly", quality: "highestaudio" });

    stream.pipe(fs.createWriteStream(audioPath));
    stream.on("end", async () => {
      return api.sendMessage({
        body: `🎶 ${video.title}`,
        attachment: fs.createReadStream(audioPath)
      }, event.threadID, () => fs.unlinkSync(audioPath));
    });

    stream.on("error", err => {
      console.log("Stream error: ", err);
      api.sendMessage("❌ Failed to download audio.", event.threadID);
    });

  } catch (err) {
    console.log("Error: ", err);
    api.sendMessage("❌ Something went wrong while processing your request.", event.threadID);
  }
};
