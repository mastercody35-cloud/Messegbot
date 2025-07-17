const axios = require("axios");
const fs = require("fs-extra");
const yts = require("yt-search");
const path = require("path");

module.exports.config = {
  name: "music",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "TalhaGPT",
  description: "Play music from YouTube",
  commandCategory: "media",
  usages: "[song name]",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  const query = args.join(" ");
  if (!query) return api.sendMessage("🎵 Please provide a song name.", event.threadID);

  const msg = await api.sendMessage("🔍 Searching for your song...", event.threadID);

  try {
    const searchResult = await yts(query);
    const video = searchResult.videos[0];
    if (!video) return api.sendMessage("❌ No results found.", event.threadID);

    const videoUrl = video.url;
    const title = video.title;
    const thumb = video.thumbnail;

    const apiRes = await axios.get(`https://youtube-mp3-download.vercel.app/api/v1?url=${videoUrl}`);
    const audioUrl = apiRes.data.link;

    const filePath = path.join(__dirname, `/cache/${event.senderID}_music.mp3`);
    const audioStream = (await axios.get(audioUrl, { responseType: "stream" })).data;

    const writer = fs.createWriteStream(filePath);
    audioStream.pipe(writer);

    writer.on("finish", () => {
      api.sendMessage({
        body: `🎶 ${title}`,
        attachment: fs.createReadStream(filePath)
      }, event.threadID, () => fs.unlinkSync(filePath));
    });

    writer.on("error", () => {
      api.sendMessage("❌ Error saving the audio.", event.threadID);
    });

  } catch (err) {
    console.error("ERROR:", err);
    api.sendMessage("❌ Failed to process the request.", event.threadID);
  }
};
