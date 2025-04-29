const uploadImage = require("../lib/uploadImage");
const { sticker } = require("../lib/sticker");
let { webp2png } = require("../lib/webp2mp4");

let handler = async (m, { conn, usedPrefix, command }) => {
  try {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || "";
    if (!(mime || /image\/(jpe?g|png)|webp/.test(mime)))
      throw `_Send/reply an image with a caption/text_\n\nExample:\n${
        usedPrefix + command
      }`;

    let img = await q.download();
    let url;
    if (/webp/.test(mime)) {
      url = await webp2png(img);
    } else {
      url = await uploadImage(img);
    }

    let apiUrl = `https://some-random-api.ml/canvas/gay?avatar=${url}`;
    let outputSticker = await sticker(null, apiUrl, "LGBT -_-", global.author);
    conn.sendFile(m.chat, outputSticker, "sgay.webp", "", m);
  } catch (e) {
    throw `_An error occurred._`;
  }
};

handler.help = ["gaysticker (caption|reply image)"];
handler.tags = ["stickerother"];
handler.command = /^sgay$/i;

// Permissions
handler.owner = false;
handler.mods = false;
handler.premium = false;
handler.group = false;
handler.private = false;
handler.admin = false;
handler.botAdmin = false;

handler.fail = null;

module.exports = handler;
