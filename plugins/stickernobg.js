const { UguuSe } = require("../lib/uploadImage");
const { webp2png } = require("../lib/webp2mp4");
const { sticker } = require("../lib/sticker");

let handler = async (m, { conn, usedPrefix, command }) => {
  try {
    // Determine the source image (quoted or sent)
    const q = m.quoted ? m.quoted : m;
    const mime = (q.msg || q).mimetype || "";
    // Require an image
    if (!/image\/(jpe?g|png)|webp/.test(mime)) {
      throw `_Send or reply to an image with caption/text_\n\nExample:\n${
        usedPrefix + command
      }`;
    }

    // Download the image data
    const img = await q.download();
    let url;
    if (/webp/.test(mime)) {
      // Convert webp to png
      url = await webp2png(img);
    } else {
      // Upload via Uguu, fallback handled internally
      url = await UguuSe(img);
    }

    // Call remove-bg API
    const removeBgUrl = global.API(
      "lolhuman",
      "/api/removebg",
      { img: url },
      "apikey"
    );
    // Create sticker from result
    const outputSticker = await sticker(
      null,
      removeBgUrl,
      global.packname,
      global.author
    );

    await m.reply("_Processing and sending..._");
    conn.sendFile(m.chat, outputSticker, "nobg.webp", "", m);
  } catch (e) {
    throw e;
    // Or you could reply: // m.reply('Conversion failed')
  }
};

handler.help = ["stikernobg", "snobg", "nobg"].map(
  (v) => `${v} (caption|reply image)`
);
handler.tags = ["sticker"];
handler.command = /^(s(tic?ker)?)?nobg$/i;
handler.limit = true;

module.exports = handler;
