module.exports.config = {
  name: "mark",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "Fixed by Talha",
  description: "Write your comment on the board image",
  commandCategory: "game",
  usages: "[text]",
  cooldowns: 5,
  dependencies: {
    "canvas": "",
    "axios": "",
    "fs-extra": ""
  }
};

module.exports.wrapText = (ctx, text, maxWidth) => {
  return new Promise(resolve => {
    if (ctx.measureText(text).width < maxWidth) return resolve([text]);
    if (ctx.measureText('W').width > maxWidth) return resolve(null);

    const words = text.split(' ');
    const lines = [];
    let line = '';

    while (words.length > 0) {
      let split = false;
      while (ctx.measureText(words[0]).width >= maxWidth) {
        const temp = words[0];
        words[0] = temp.slice(0, -1);
        if (split) words[1] = `${temp.slice(-1)}${words[1]}`;
        else {
          split = true;
          words.splice(1, 0, temp.slice(-1));
        }
      }

      if (ctx.measureText(`${line}${words[0]}`).width < maxWidth) {
        line += `${words.shift()} `;
      } else {
        lines.push(line.trim());
        line = '';
      }

      if (words.length === 0) lines.push(line.trim());
    }

    return resolve(lines);
  });
};

module.exports.run = async function ({ api, event, args }) {
  const fs = global.nodemodule["fs-extra"];
  const axios = global.nodemodule["axios"];
  const { loadImage, createCanvas } = require("canvas");

  const { threadID, messageID } = event;
  const text = args.join(" ");

  if (!text) {
    return api.sendMessage("❗ Please enter the content you want to write on the board.", threadID, messageID);
  }

  const backgroundURL = "https://i.imgur.com/3j4GPdy.jpg";
  const imagePath = __dirname + "/cache/mark_board.png";

  try {
    const imageResponse = await axios.get(backgroundURL, { responseType: "arraybuffer" });
    fs.writeFileSync(imagePath, Buffer.from(imageResponse.data, "utf-8"));

    const baseImage = await loadImage(imagePath);
    const canvas = createCanvas(baseImage.width, baseImage.height);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
    let fontSize = 45;
    ctx.font = `${fontSize}px Arial`;
    ctx.fillStyle = "#000000";
    ctx.textAlign = "start";

    // Resize font if too wide
    while (ctx.measureText(text).width > 440) {
      fontSize -= 1;
      ctx.font = `${fontSize}px Arial`;
    }

    const lines = await this.wrapText(ctx, text, 440);
    ctx.fillText(lines.join('\n'), 95, 420); // X and Y position

    const finalImage = canvas.toBuffer();
    fs.writeFileSync(imagePath, finalImage);

    return api.sendMessage({ attachment: fs.createReadStream(imagePath) }, threadID, () => fs.unlinkSync(imagePath), messageID);

  } catch (err) {
    console.error(err);
    return api.sendMessage("❌ Error: Unable to create image. Try again later.", threadID, messageID);
  }
};
