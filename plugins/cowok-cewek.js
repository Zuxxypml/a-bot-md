let fetch = require("node-fetch");
let { pinterest } = require("@bochilteam/scraper");

let handler = async (m, { conn, text, usedPrefix, command }) => {
  let res = await pinterest("photo " + command.replace("k", ""));
  if (!res.length) throw "No results found.";

  let pint = conn.pickRandom(res);
  await conn.sendFile(m.chat, pint, "img.jpg", "", m);
};

handler.help = ["boy", "girl"];
handler.tags = ["image", "random"];
handler.command = /^(boy|girl|woman|lady|model)$/i;

module.exports = handler;
