const { MessageType } = require("@whiskeysockets/baileys");
const { sticker } = require("../lib/sticker.js");

let handler = async (m, { conn, args, usedPrefix, command }) => {
  let stiker = false;
  try {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || "";
    if (/image|video/.test(mime)) {
      let img = await q.download();
      if (!img) throw "Please reply to a sticker or image!";
      let senderName = m.sender ? conn.getName(m.sender) : "User";
      stiker = await sticker(
        img,
        false,
        senderName + " ✅",
        "To keep our connection strong, please lend me a hundred bucks 😁"
      );
    } else if (args[0]) {
      let senderName = m.sender ? conn.getName(m.sender) : "User";
      let url = args[0];
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        // automatically add https:// if user forgets
        url = "https://" + url;
      }
      stiker = await sticker(
        false,
        url,
        senderName + " ✅",
        "To keep our connection strong, please lend me a hundred bucks 😁"
      );
    } else {
      throw `Reply to a sticker or image or type '${usedPrefix}${command} [link/url]'\n\n==============================\n${
        usedPrefix + command
      } <Reply to an image>\n${usedPrefix + command} <Reply to a sticker>\n${
        usedPrefix + command
      } https://api.duniagames.co.id/api/content/upload/file/7081780811647600895.png\n${
        usedPrefix + command
      } api.duniagames.co.id/api/content/upload/file/7081780811647600895.png\n==============================`;
    }
  } finally {
    if (stiker) conn.sendFile(m.chat, stiker, "sticker.webp", "", m);
  }
};

handler.help = ["steal <reply sticker>/<reply image>/<URL/LINK>"];
handler.tags = ["sticker"];
handler.command = /^(colong)$/i; // command remains "colong" unless you want to change it too

module.exports = handler;
