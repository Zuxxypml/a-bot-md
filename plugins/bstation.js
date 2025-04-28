/*
Don't remove the watermark, please!

*Bilibili/Bstation Search Plugin (CJS Version)*

*[Source Channel]*
https://whatsapp.com/channel/0029Vb3u2awADTOCXVsvia28

*[Scrape Source]*
https://whatsapp.com/channel/0029VadfVP5ElagswfEltW0L/2192
*/

const axios = require("axios");
const cheerio = require("cheerio");

async function getBsTation(query) {
  try {
    const url = `https://www.bilibili.tv/id/search-result?q=${query}`;
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    let result = [];

    $(".card-container").each((_, el) => {
      const title = $(el).find("p.card-container__title").text().trim();
      const videoUrl = "https://www.bilibili.tv" + $(el).find("a").attr("href");
      const imageUrl = $(el).find("img").attr("src");
      const views = $(el).find("span.meta__tips-text").text().trim();
      const description = $(el).find("p").text().trim();

      result.push({
        title,
        videoUrl,
        imageUrl,
        views,
        description,
      });
    });
    return result;
  } catch (e) {
    console.error(e);
    return [];
  }
}

let handler = async (m, { conn, text }) => {
  if (!text)
    return m.reply(
      "Please provide a search query.\n\n*Example:* .bilibili Spy X Family"
    );

  try {
    const result = await getBsTation(text);

    if (result.length === 0) {
      return m.reply("No results found. Please try a different query.");
    }

    let caption = "*Bilibili Search Results*\n\n";

    for (let item of result) {
      caption += `*Title:* ${item.title}\n`;
      caption += `*Views:* ${item.views}\n`;
      caption += `*Description:* ${item.description}\n`;
      caption += `*Link:* ${item.videoUrl}\n\n`;
    }

    await conn.sendMessage(
      m.chat,
      {
        image: { url: result[0].imageUrl },
        caption,
      },
      { quoted: m }
    );
  } catch (e) {
    console.error(e);
    m.reply("An error occurred while searching.");
  }
};

handler.help = ["bilibili <query>"];
handler.tags = ["internet"];
handler.command = ["bilibili", "bstation"];

module.exports = handler;
