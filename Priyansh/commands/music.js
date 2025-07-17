const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "music",
    aliases: ["yt", "yta"],
    version: "1.0",
    author: "Talha + ChatGPT",
    countDown: 5,
    role: 0,
    shortDescription: "Download YouTube audio",
    longDescription: "Download a YouTube song by title or link",
    category: "media",
    guide: "{p}music <song name or YouTube link>"
  },

  onStart: async function ({ api, event, args }) {
    const query = args.join(" ");
    if (!query)
      return api.sendMessage("❌ Please provide a song name or YouTube link.", event.threadID, event.messageID);

    try {
      const msg = await api.sendMessage("🔍 Searching for your song...", event.threadID);

      const res = await axios.get(`https://api.akuari.my.id/downloader/ytaudio?link=${encodeURIComponent(query)}`);
      const data = res.data;

      if (!data || !data.title || !data.url)
        return api.sendMessage("❌ Unable to fetch the song. Try again.", event.threadID, event.messageID);

      const audioUrl = data.url;
      const title = data.title;
      const thumb = data.thumb;
      const filename = `${title}.mp3`;
      const filepath = path.join(__dirname, "cache", filename);

      // Download audio
      const writer = fs.createWriteStream(filepath);
      const audioRes = await axios.get(audioUrl, { responseType: "stream" });
      audioRes.data.pipe(writer);

      writer.on("finish", async () => {
        const message = {
          body: `🎶 Title: ${title}\n📥 Downloaded successfully!`,
          attachment: fs.createReadStream(filepath)
        };
        api.sendMessage(message, event.threadID, () => fs.unlinkSync(filepath), event.messageID);
      });

      writer.on("error", () => {
        api.sendMessage("❌ Error downloading audio.", event.threadID, event.messageID);
      });

    } catch (e) {
      console.error(e);
      api.sendMessage("❌ Error occurred while fetching music.", event.threadID, event.messageID);
    }
  }
};
