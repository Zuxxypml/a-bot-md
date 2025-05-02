const uploadFile = require("../lib/uploadFile");
const uploadImage = require("../lib/uploadImage");

let handler = async (m, { command, usedPrefix }) => {
  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || "";

  if (!mime) {
    throw `⚠️ Please send or reply to an image or file with a caption.\n\nExample:\n${
      usedPrefix + command
    }`;
  }

  let media = await q.download();
  let isImageOrShortVideo = /image\/(png|jpe?g|gif)|video\/mp4/.test(mime);

  let link = await (isImageOrShortVideo ? uploadImage : uploadFile)(media);

  m.reply(`${link}
📦 ${media.length} byte(s)
🕓 ${isImageOrShortVideo ? "(Permanent link)" : "(May expire)"}`);
};

handler.help = ["upload (caption or reply to media)"];
handler.tags = ["tools"];
handler.command = /^upload$/i;

module.exports = handler;
