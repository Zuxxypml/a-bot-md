/*
[ AniList Plugin ]
By Fruatre
wa.me/6285817597752
Channel: https://whatsapp.com/channel/0029VaNR2B6BadmioY6mar3N
*/

const axios = require("axios");
const cheerio = require("cheerio");

const handler = async (m, { text, command }) => {
  const [type, query] = text.split("#");
  if (!type || !query) {
    return m.reply(`Use format: .anilist ${command}#query`);
  }

  if (type === "search") {
    const results = await searchAnime(query);
    if (!results.length) return m.reply("No results found.");
    const response = results
      .map(({ title, imageUrl, link }) => `*${title}*\n${link}\n`)
      .join("\n");
    return m.reply(response);
  }

  if (type === "detail") {
    const result = await animeDetail(query);
    if (!result) return m.reply("Details not found.");
    const { title, description, cover, genres } = result;
    return m.reply(
      `*${title.romaji}*\n\nDescription: ${
        description.translated
      }\nGenres: ${genres.translated.join(", ")}\nCover Image: ${cover}`
    );
  }
};

// Search for anime based on a query
async function searchAnime(query) {
  const { data } = await axios.get(
    `https://anilist.co/search/anime?query=${encodeURIComponent(query)}`
  );
  const $ = cheerio.load(data);
  return $(".media-card")
    .map((_, el) => ({
      title: $(el).find(".title").text().trim(),
      imageUrl: $(el).find(".image").attr("src"),
      link: `https://anilist.co${$(el).find(".cover").attr("href")}`,
    }))
    .get();
}

// Fetch anime details based on URL
async function animeDetail(url) {
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);
  const descriptionText = $(".description.content-wrap")
    .text()
    .replace(/\n\s+/g, " ")
    .trim();
  return {
    title: {
      romaji: $(".content h1").first().text().trim(),
    },
    description: {
      translated: descriptionText,
    },
    cover: $(".cover-wrap-inner .cover").attr("src"),
    genres: {
      translated: $('div.data-set:contains("Genres") .value a')
        .map((_, el) => $(el).text().trim())
        .get(),
    },
  };
}

handler.help = ["anilist"];
handler.tags = ["anime"];
handler.command = ["anilist"];

module.exports = handler;
