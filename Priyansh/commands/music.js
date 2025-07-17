const axios = require("axios");
const fs = require("fs-extra");
const yts = require("yt-search");
const path = require("path");

module.exports.config = {
  name: "music",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "TalhaGPT",
  description: "Play music from YouTube",
  commandCategory: "media",
  usages: "[song name or YouTube link]",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  const search = args.join(" ");
  if (!search) return api.sendMessage("🎵 Please enter a song name or YouTube link.", event.threadID, event.messageID);

  const msgID = await api.sendMessage("🔍 Searching for your song...", event.threadID);

  try {
    const result = await yts(search);
    const video = result.videos[0];
    if (!video) return api.sendMessage("❌ Song not found.", event.threadID, event.messageID);

    const res = await axios.get(`https://youtube-mp3-download.vercel.app/api/v1?url=${video.url}`);
    if (!res.data || !res.data.link) return api.sendMessage("❌ Failed to fetch audio.", event.threadID, event.messageID);

    const audioPath = path.join(__dirname, `cache/${event.senderID}_music.mp3`);
    const audioStream = await axios.get(res.data.link, { responseType: 'stream' });

    const writer = fs.createWriteStream(audioPath);
    audioStream.data.pipe(writer);

    writer.on("finish", () => {
      api.sendMessage({
        body: `🎶 Now Playing: ${video.title}`,
        attachment: fs.createReadStream(audioPath)
      }, event.threadID, () => fs.unlinkSync(audioPath));
    });

    writer.on("error", () => {
      api.sendMessage("❌ Error saving audio file.", event.threadID);
    });

  } catch (e) {
    console.log(e);
    return api.sendMessage("⚠️ Error occurred while fetching music.", event.threadID);
  }
};
