let fetch = require("node-fetch");

let handler = async (m, { conn, usedPrefix, command }) => {
  let res = global.API("lolhuman", "/api/meme/darkjoke", "", "apikey");
  m.reply("_Searching for a dark joke..._");
  await conn.sendFile(m.chat, res, "img.jpg", `(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧ Enjoy!`, m);
};

handler.help = ["darkjoke"];
handler.tags = ["image", "random"];
handler.command = /^darkjoke(s)?$/i;

module.exports = handler;
