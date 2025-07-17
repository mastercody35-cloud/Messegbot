const axios = require("axios");
const fs = require("fs-extra");
const yts = require("yt-search");
const path = require("path");

module.exports.config = {
  name: "music",
  version: "1.1.0",
  hasPermssion: 0,
  credits: "TalhaGPT",
  description: "Play music from YouTube",
  commandCategory: "media",
  usages: "[song name]",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  const query = args.join(" ");
  if (!query) return api.sendMessage("❌ Song name likho bhai!", event.threadID);

  api.sendMessage("🔍 Dhoondh raha hoon gaana...", event.threadID, async (err, info) => {
    try {
      const searchResult = await yts(query);
      const video = searchResult.videos[0];
      if (!video) return api.sendMessage("❌ Koi gaana nahi mila.", event.threadID);

      const videoId = video.videoId;
      const apiURL = `https://api.vevioz.com/api/button/mp3/${videoId}`;

      const page = await axios.get(apiURL);
      const regex = /<a href="(https:\/\/[^"]+)"[^>]*>Download<\/a>/;
      const match = regex.exec(page.data);

      if (!match || !match[1]) return api.sendMessage("❌ Download link nahi mila.", event.threadID);

      const downloadLink = match[1];
      const filePath = path.join(__dirname, `/cache/music_${event.senderID}.mp3`);

      const response = await axios.get(downloadLink, { responseType: "stream" });
      const writer = fs.createWriteStream(filePath);
      response.data.pipe(writer);

      writer.on("finish", () => {
        api.sendMessage({
          body: `🎵 Gaana mil gaya: ${video.title}`,
          attachment: fs.createReadStream(filePath)
        }, event.threadID, () => fs.unlinkSync(filePath));
      });

      writer.on("error", () => {
        api.sendMessage("❌ File save nahi hui.", event.threadID);
      });

    } catch (err) {
      console.error(err);
      return api.sendMessage("⚠️ Error: Gaana fetch nahi hua.", event.threadID);
    }
  });
};
