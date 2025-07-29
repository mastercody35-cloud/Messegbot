module.exports.config = {
  name: "pair",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "Fixed by Talha ✨",
  description: "Pair two members in group randomly with DPs",
  commandCategory: "Love 💞",
  usages: "",
  cooldowns: 10
};

const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { loadImage, createCanvas } = require("canvas");

module.exports.run = async function ({ api, event, Users }) {
  const threadInfo = await api.getThreadInfo(event.threadID);
  const members = threadInfo.participantIDs.filter(id => id !== api.getCurrentUserID());

  // Separate males and females (optional logic, currently just random pairing)
  if (members.length < 2) {
    return api.sendMessage("⚠️ Group mein pairing ke liye kaafi log nahi hain!", event.threadID, event.messageID);
  }

  // Random 2 members
  const [id1, id2] = shuffleArray(members).slice(0, 2);
  const name1 = await Users.getNameUser(id1);
  const name2 = await Users.getNameUser(id2);

  const pathAvt1 = path.join(__dirname, "cache", `${id1}_dp.png`);
  const pathAvt2 = path.join(__dirname, "cache", `${id2}_dp.png`);
  const bgPath = path.join(__dirname, "cache", "pair_bg.jpg");

  // Download background image once
  if (!fs.existsSync(bgPath)) {
    const bg = (await axios.get("https://i.imgur.com/FN4Wb6w.jpeg", { responseType: "arraybuffer" })).data;
    fs.writeFileSync(bgPath, Buffer.from(bg, "utf-8"));
  }

  // Download DPs with fallback
  async function downloadDP(id, savePath) {
    try {
      const img = (
        await axios.get(`https://graph.facebook.com/${id}/picture?width=720&height=720`, {
          responseType: "arraybuffer"
        })
      ).data;
      fs.writeFileSync(savePath, Buffer.from(img, "utf-8"));
    } catch (e) {
      // fallback image
      const fallback = (
        await axios.get("https://i.imgur.com/qRPVqQD.png", { responseType: "arraybuffer" })
      ).data;
      fs.writeFileSync(savePath, Buffer.from(fallback, "utf-8"));
    }
  }

  await downloadDP(id1, pathAvt1);
  await downloadDP(id2, pathAvt2);

  // Create canvas
  const canvas = createCanvas(800, 600);
  const ctx = canvas.getContext("2d");
  const bg = await loadImage(bgPath);
  ctx.drawImage(bg, 0, 0, 800, 600);

  const avt1 = await loadImage(pathAvt1);
  const avt2 = await loadImage(pathAvt2);

  // Draw circular DPs
  drawCircleImage(ctx, avt1, 170, 200, 100);
  drawCircleImage(ctx, avt2, 530, 200, 100);

  // Add names
  ctx.font = "bold 32px Arial";
  ctx.fillStyle = "#ff69b4";
  ctx.fillText(name1, 130, 360);
  ctx.fillText("❤️ LOVE ❤️", 290, 320);
  ctx.fillText(name2, 510, 360);

  const outPath = path.join(__dirname, "cache", `pair_result_${event.threadID}.png`);
  const outStream = fs.createWriteStream(outPath);
  const stream = canvas.createPNGStream();
  stream.pipe(outStream);
  outStream.on("finish", () => {
    api.sendMessage({
      body: `💘 𝓛𝓞𝓥𝓔 𝓟𝓐𝓘𝓡 𝓐𝓛𝓔𝓡𝓣 💘\n\n🥰 ${name1} ❤️ ${name2}\n\n🔥 Kitni cute jodi hai na!`,
      mentions: [
        { tag: name1, id: id1 },
        { tag: name2, id: id2 }
      ],
      attachment: fs.createReadStream(outPath)
    }, event.threadID, () => {
      fs.unlinkSync(pathAvt1);
      fs.unlinkSync(pathAvt2);
      fs.unlinkSync(outPath);
    }, event.messageID);
  });
};

// Helpers
function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

function drawCircleImage(ctx, image, x, y, size) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(image, x, y, size, size);
  ctx.restore();
}
