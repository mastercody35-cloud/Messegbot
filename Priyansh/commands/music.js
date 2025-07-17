const axios = require("axios");
const ytdl = require("ytdl-core");
const fs = require("fs-extra");
const path = require("path");
const ytSearch = require("yt-search");

module.exports.config = {
  name: "music",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "TalhaGPT",
  description: "Download YouTube audio by name or link",
  commandCategory: "media",
  usages: "[song name or YouTube link]",
  cooldowns: 5,
};

module.exports.run = async ({ api, event, args }) => {
  const query = args.join(" ");
  if (!query) return api.sendMessage("🎵 Please provide a song name or YouTube link.", event.threadID, event.messageID);

  const msg = await api.sendMessage("🔍 Searching for your song...", event.threadID, event.messageID);

  try {
    let video;
    if (ytdl.validateURL(query)) {
      const info = await ytdl.getInfo(query);
      video = { title: info.videoDetails.title, url: info.videoDetails.video_url, thumbnail: info.videoDetails.thumbnails[0].url };
    } else {
      const result = await ytSearch(query);
      video = result.videos.length > 0 ? result.videos[0] : null;
    }

    if (!video) return api.sendMessage("❌ Song not found.", event.threadID, event.messageID);

    const streamPath = path.join(__dirname, `cache/${event.senderID}_music.mp3`);
    const audioStream = ytdl(video.url, { filter: "audioonly", quality: "highestaudio" });

    audioStream.pipe(fs.createWriteStream(streamPath));

    audioStream.on("end", async () => {
      const thumbnailStream = await global.utils.getStreamFromURL(video.thumbnail);
      await api.sendMessage({
        body: `🎶 Title: ${video.title}`,
        attachment: fs.createReadStream(streamPath),
      }, event.threadID, () => fs.unlinkSync(streamPath));
    });

    audioStream.on("error", err => {
      console.error(err);
      api.sendMessage("❌ Error downloading audio.", event.threadID);
    });

  } catch (err) {
    console.error(err);
    api.sendMessage("❌ Failed to fetch song.", event.threadID);
  }
};
