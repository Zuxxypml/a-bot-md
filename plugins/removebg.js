const { removeBackgroundFromImageUrl } = require("remove.bg");
const { UguuSe } = require("../lib/uploadImage.js");

let handler = async (m, { conn, usedPrefix, command }) => {
  try {
    // Determine the target message (quoted image or the message itself)
    let q = m.quoted || m;
    let mime = (q.msg || q).mimetype || "";

    // Validate that an image was provided
    if (!mime) throw "❓ Please provide an image!";
    if (!/image\/(jpe?g|png)/.test(mime)) {
      throw `❌ Unsupported media type: ${mime}. Only JPEG or PNG allowed!`;
    }

    // Notify user processing has started
    m.reply("⏳ Removing background, please wait...");

    // Download image and upload to hosting
    let imgBuffer = await q.download();
    let imageUrl = await UguuSe(imgBuffer);

    // First try built-in API remove-bg endpoint
    let resultUrl = API("lol", "/api/removebg", { img: imageUrl }, "apikey");
    await conn.sendFile(
      m.chat,
      resultUrl,
      "no-bg.png",
      "✅ Here is your image with background removed!",
      m
    );
  } catch (err) {
    // Fallback to remove.bg if built-in fails
    try {
      let q = m.quoted || m;
      let mime = (q.msg || q).mimetype || "";
      if (!mime) throw "❓ Please provide an image!";
      if (!/image\/(jpe?g|png)/.test(mime)) {
        throw `❌ Unsupported media type: ${mime}. Only JPEG or PNG allowed!`;
      }

      m.reply("⏳ Removing background with fallback service...");

      let imgBuffer = await q.download();
      let imageUrl = await UguuSe(imgBuffer);
      let outBuffer = await removeBgFallback(imageUrl);

      await conn.sendFile(
        m.chat,
        outBuffer,
        "no-bg.png",
        "✅ Here is your image with background removed!",
        m
      );
    } catch (e) {
      console.error(e);
      m.reply(`❌ Failed to remove background: ${e.message || e}`);
    }
  }
};

handler.help = ["removebg"];
handler.tags = ["tools", "premium"];
handler.command = /^(removebg)$/i;
handler.premium = false;

module.exports = handler;

/**
 * Fallback background removal using remove.bg API
 * @param {string} url - URL of the hosted image
 * @returns {Buffer} - Buffer of the processed image
 */
async function removeBgFallback(url) {
  try {
    const result = await removeBackgroundFromImageUrl({
      url,
      apiKey: getRandomApiKey(),
      size: "regular",
      type: "auto",
    });
    return Buffer.from(result.base64img, "base64");
  } catch (e) {
    throw new Error(e.message || "remove.bg error");
  }
}

// A small pool of API keys for remove.bg
function getRandomApiKey() {
  const keys = [
    "t4DJWibUPdxTbCiZs6wXUTMB",
    "Divb33Vh3YANNFJMPkv4QJs3",
    "61N7EMLJURGuTdYpavHwkWTC",
  ];
  return keys[Math.floor(Math.random() * keys.length)];
}
