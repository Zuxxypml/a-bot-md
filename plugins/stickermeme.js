const uploadFile = require("../lib/uploadFile");
const { UguuSe } = require("../lib/uploadImage");
const { sticker } = require("../lib/sticker");
let { webp2png } = require("../lib/webp2mp4");

let handler = async (m, { conn, text, usedPrefix, isPrems, command }) => {
  // Determine source image (quoted or sent)
  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || "";
  // Check for valid image mime
  if (!/image\/(jpe?g|png)|webp/.test(mime))
    throw `_Send or reply to an image with caption/text_\n\nExample:\n${
      usedPrefix + command
    } Hello | you`;

  // Split the input into top and bottom text
  let [topText, bottomText] = text.split`|`;
  if (!topText)
    throw `_Please provide text!_\n\nExample:\n${
      usedPrefix + command
    } Top text | Bottom text (optional)`;

  // If only one text part, use it as bottom and leave top blank
  if (!bottomText) {
    bottomText = topText;
    topText = "_";
  }

  // Download the image data
  let imgData = await q.download();
  let linkInfo;
  if (/webp/.test(mime)) {
    // Convert webp to png
    linkInfo = await webp2png(imgData);
  } else {
    // Try uploading via Uguu, fallback to generic upload
    linkInfo = await UguuSe(imgData).catch(() => uploadFile(imgData));
  }

  // Build the MemeGen API URL
  let memeUrl = global.API(
    "https://api.memegen.link",
    `/images/custom/${encodeURIComponent(topText)}/${encodeURIComponent(
      bottomText
    )}.png`,
    { background: linkInfo.url }
  );

  // Determine author: premium users see their name
  let user = global.db.data.users[m.sender];
  let author = isPrems ? user.name : global.author;

  // Create sticker and send it
  let outputSticker = await sticker(false, memeUrl, "mememaker", author);
  conn.sendFile(m.chat, outputSticker, "memeSticker.webp", "", m);
};

handler.help = [
  "smeme <topText|bottomText>",
  "stikermeme <topText|bottomText>",
];
handler.tags = ["stickerother"];
handler.command = /^(s(tic?ker)?meme)$/i;

module.exports = handler;
