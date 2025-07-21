async function makeImage({ one, two }) {
  const fs = global.nodemodule["fs-extra"];
  const path = global.nodemodule["path"];
  const axios = global.nodemodule["axios"];
  const jimp = global.nodemodule["jimp"];
  const __root = path.resolve(__dirname, "cache", "canvas");

  if (!fs.existsSync(__root)) fs.mkdirSync(__root, { recursive: true });

  const pairingImgUrl = "https://i.ibb.co/bgFhk6Bb/Messenger-creation-2611011159251969.jpg";
  const baseImagePath = path.join(__root, "pairing_temp.png");

  try {
    const baseImageBuffer = (await axios.get(pairingImgUrl, { responseType: 'arraybuffer' })).data;
    fs.writeFileSync(baseImagePath, Buffer.from(baseImageBuffer, 'binary'));
  } catch (error) {
    console.error("Error downloading base image:", error.message);
    throw new Error("Failed to download base image.");
  }

  const pairing_img = await jimp.read(baseImagePath);
  const pathImg = path.join(__root, `pairing_${one}_${two}.png`);
  const avatarOne = path.join(__root, `avt_${one}.png`);
  const avatarTwo = path.join(__root, `avt_${two}.png`);

  try {
    const getAvatarOne = (await axios.get(
      `https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
      { responseType: 'arraybuffer' }
    )).data;
    fs.writeFileSync(avatarOne, Buffer.from(getAvatarOne, 'binary'));
  } catch (error) {
    console.error(`Error downloading avatar for user ${one}:`, error.message);
    throw new Error(`Failed to download avatar for user ${one}.`);
  }

  try {
    const getAvatarTwo = (await axios.get(
      `https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
      { responseType: 'arraybuffer' }
    )).data;
    fs.writeFileSync(avatarTwo, Buffer.from(getAvatarTwo, 'binary'));
  } catch (error) {
    console.error(`Error downloading avatar for user ${two}:`, error.message);
    throw new Error(`Failed to download avatar for user ${two}.`);
  }

  const circleOne = await jimp.read(await circle(avatarOne));
  const circleTwo = await jimp.read(await circle(avatarTwo));

  // 🎯 Exact DP placement inside red rings
  pairing_img
    .composite(circleOne.resize(365, 365), 105, 135)   // Left ring
    .composite(circleTwo.resize(365, 365), 785, 135);  // Right ring

  const raw = await pairing_img.getBufferAsync("image/png");
  fs.writeFileSync(pathImg, raw);

  fs.unlinkSync(avatarOne);
  fs.unlinkSync(avatarTwo);
  fs.unlinkSync(baseImagePath);

  return pathImg;
}
