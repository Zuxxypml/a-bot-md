/*
*[Christian Plugin]* 
By Fruatre
wa.me/6285817597752
Channel: https://whatsapp.com/channel/0029VaNR2B6BadmioY6mar3N
*/

const fetch = require("node-fetch");
const axios = require("axios");
const cheerio = require("cheerio");

const handler = async (m, { text, usedPrefix, command }) => {
  if (!text)
    throw `Uhmm... where's the text?\n\nExample:\n${
      usedPrefix + command
    } genesis`;

  let res = await axios.get(
    `https://alkitab.me/search?q=${encodeURIComponent(text)}`,
    {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36",
      },
    }
  );

  let $ = cheerio.load(res.data);
  let result = [];
  $("div.vw").each(function (a, b) {
    let verseText = $(b).find("p").text().trim();
    let link = $(b).find("a").attr("href");
    let title = $(b).find("a").text().trim();
    result.push({ verseText, link, title });
  });

  let photo = "https://telegra.ph/file/a333442553b1bc336cc55.jpg";
  let heading = "*────────「 Bible Search 」────────*";
  let caption = result
    .map((v) => `💌 ${v.title}\n📮 ${v.verseText}`)
    .join("\n┄┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┄\n");

  conn.sendFile(m.chat, photo, "bible.jpg", `${heading}\n\n${caption}`, m);
};

handler.help = ["bible"].map((v) => v + " <search>");
handler.tags = ["internet"];
handler.command = /^(alkitab)$/i;

module.exports = handler;
