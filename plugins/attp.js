const fetch = require("node-fetch");
const { sticker } = require("../lib/sticker");

let handler = async (m, { conn, text, usedPrefix, command }) => {
  let teks = text ? text : m.quoted && m.quoted.text ? m.quoted.text : m.text;
  if (!teks)
    throw `Reply to a message or type some text!\n\nExample:\n${usedPrefix}attp Hello World`;

  let res = await sticker(
    null,
    global.API("https://api.erdwpe.com/api/maker/", "attp?text", {
      file: "",
      text: teks,
    }),
    global.packname,
    global.author
  );

  if (res) return conn.sendFile(m.chat, res, "sticker.webp", "", m);
  throw res.toString();
};

handler.help = ["", "2"].map((v) => "attp" + v + " <text>");
handler.command = /^a?ttp$/i;
handler.tags = ["stickertext"];
handler.limit = true;
handler.fail = null;

module.exports = handler;
