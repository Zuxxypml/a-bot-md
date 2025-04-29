const uploadImage = require("../lib/uploadImage");
const { sticker } = require("../lib/sticker");
const { webp2png } = require("../lib/webp2mp4");
const fetch = require("node-fetch");

let handler = async (m, { conn, command }) => {
  let url;
  let effect = command.replace(/ed$/i, ""); // e.g. 'wasted' → 'wast', 'triggered' → 'trigger'

  // If someone is tagged, use their profile picture
  if (m.mentionedJid && m.mentionedJid[0]) {
    let ppUrl;
    try {
      ppUrl = await conn.profilePictureUrl(m.mentionedJid[0], "image");
    } catch (e) {
      throw "The user you tagged has no profile picture or it is private.";
    }
    let res = await fetch(ppUrl);
    let buffer = await res.buffer();
    url = await uploadImage(buffer);

    // Otherwise use the quoted or sent image/sticker
  } else {
    let q = m.quoted || m;
    let mime = (q.msg || q).mimetype || "";
    if (!/image\/(jpe?g|png)|webp/.test(mime)) {
      throw "Please send or reply to an image or sticker.";
    }
    let img = await q.download();
    if (/webp/.test(mime)) {
      url = await webp2png(img);
    } else {
      url = await uploadImage(img);
    }
  }

  await m.reply("_Processing and sending..._");
  let apiUrl = `https://some-random-api.ml/canvas/${effect}ed?avatar=${url}`;
  let outputSticker = await sticker(
    null,
    apiUrl,
    global.packname,
    global.author
  );
  conn.sendFile(m.chat, outputSticker, `${effect}.webp`, "", m);
};

handler.help = [
  "trigger (caption|reply image)",
  "wasted (caption|reply image)",
];
handler.tags = ["stickerother"];
handler.command = /^(wasted|trigger(ed)?)$/i;

handler.owner = false;
handler.mods = false;
handler.premium = false;
handler.group = false;
handler.private = false;
handler.admin = false;
handler.botAdmin = false;
handler.fail = null;

module.exports = handler;
