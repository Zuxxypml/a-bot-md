const fetch = require("node-fetch");

let handler = async (m, { conn, command, usedPrefix }) => {
  m.reply("_Searching for an image..._");
  try {
    let res = await fetch(`https://api.waifu.pics/sfw/${command}`);
    let json = await res.json();
    await conn.sendFile(m.chat, json.url, "image.jpg", "", m);
  } catch (error) {
    console.error(error);
    m.reply("Sorry, failed to fetch the image.");
  }
};

handler.help = handler.command = [
  "shinobu",
  "megumin",
  "waifu",
  "neko",
  "bully",
  "cuddle",
];
handler.tags = ["imagerandom"];

module.exports = handler;
