const moewalls = require("../lib/moewalls");

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    throw `Please enter a keyword and an index number separated by "|"\n\nExample:\n${usedPrefix}${command} elaina|1\n\n*The index allows you to select from multiple results.*`;
  }

  let url = text.split("|")[0];
  let page = text.split("|")[1] || "1"; // Default to "1" if second part is missing

  // Convert page to array index (0-based)
  let index = parseInt(page) - 1;

  try {
    conn.reply(m.chat, `_Processing, please wait..._`, m);

    // Get response from scraper
    const response = await moewalls(url);
    var res = response;

    let caption = `╭──── 〔MOEWALLS〕 ─⬣\n`;
    caption += ` ⬡ *Search Query* : ${res.query}\n`;
    caption += ` ⬡ *Total Results* : ${res.total}\n`;
    caption += `╰────────⬣\n`;
    caption += ` ⬡ *Title* : ${res.wallpapers[index].title}\n`;
    caption += ` ⬡ *Source* : ${res.wallpapers[index].source}\n`;
    caption += ` ⬡ *Showing* : ${res.wallpapers[index].index} - ${res.total}\n`;

    await conn.sendMessage(
      m.chat,
      {
        video: { url: res.wallpapers[index].video },
        caption: caption,
      },
      { quoted: m }
    );
  } catch (e) {
    throw `Error: ${e.message || e}`;
  }
};

handler.help = ["moewalls"];
handler.command = /^(moewalls)$/i;
handler.tags = ["downloader", "tools"];
handler.premium = false;

module.exports = handler;
