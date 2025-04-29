const axios = require("axios");
const cheerio = require("cheerio");

class HarimangaScraper {
  constructor() {
    this.baseUrl = "https://harimanga.me";
    this.timeout = 10000; // 10 seconds timeout
  }

  async fetchData(url) {
    try {
      const { data } = await axios.get(url, {
        timeout: this.timeout,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
      });
      return cheerio.load(data);
    } catch (error) {
      console.error("Fetch Error:", error);
      throw new Error("Failed to fetch data from Harimanga");
    }
  }

  async search(query, limit = 5) {
    try {
      const url = `${this.baseUrl}/?s=${encodeURIComponent(
        query
      )}&post_type=wp-manga`;
      const $ = await this.fetchData(url);
      const results = [];

      $(".c-tabs-item__content").each((i, el) => {
        if (results.length >= limit) return false;

        const title = $(el).find(".post-title a").text().trim();
        const link = $(el).find(".post-title a").attr("href");
        const image = $(el).find(".tab-thumb img").attr("src") || "";
        const genres = $(el)
          .find(".mg_genres .summary-content a")
          .map((_, g) => $(g).text().trim())
          .get();
        const status = $(el).find(".mg_status .summary-content").text().trim();
        const latestChapter = $(el)
          .find(".latest-chap .chapter a")
          .text()
          .trim();
        const rating = $(el).find(".rating .score").text().trim();

        results.push({
          title,
          link,
          image,
          genres,
          status,
          latestChapter,
          rating,
        });
      });

      return results;
    } catch (error) {
      console.error("Search Error:", error);
      throw new Error("Failed to perform search");
    }
  }

  async getLatestUpdates(limit = 5) {
    try {
      const $ = await this.fetchData(this.baseUrl);
      const results = [];

      $(".page-listing-item").each((i, el) => {
        if (results.length >= limit) return false;

        const title = $(el).find(".post-title h3 a").text().trim();
        const link = $(el).find(".post-title h3 a").attr("href");
        const latestChapter = $(el)
          .find(".list-chapter .chapter-item .chapter a")
          .first()
          .text()
          .trim();
        const chapterLink = $(el)
          .find(".list-chapter .chapter-item .chapter a")
          .first()
          .attr("href");

        results.push({ title, link, latestChapter, chapterLink });
      });

      return results;
    } catch (error) {
      console.error("Latest Updates Error:", error);
      throw new Error("Failed to fetch latest updates");
    }
  }

  async getMangaDetails(url) {
    try {
      if (!url.startsWith(this.baseUrl)) {
        throw new Error("Invalid URL - must be from harimanga.me");
      }

      const $ = await this.fetchData(url);

      const title = $(".post-title h1").text().trim();
      const image = $(".summary_image img").attr("src") || "";
      const rating =
        $(".post-total-rating .score").first().text().trim() || "N/A";
      const rank =
        $('.post-content_item:contains("Rank") .summary-content')
          .text()
          .trim() || "N/A";
      const status =
        $('.post-content_item:contains("Status") .summary-content')
          .text()
          .trim() || "N/A";
      const genres = $(
        '.post-content_item:contains("Genre(s)") .genres-content a'
      )
        .map((_, el) => $(el).text().trim())
        .get();

      return { title, image, rating, rank, status, genres };
    } catch (error) {
      console.error("Details Error:", error);
      throw new Error("Failed to fetch manga details");
    }
  }

  async getChapterList(url, limit = 10) {
    try {
      if (!url.startsWith(this.baseUrl)) {
        throw new Error("Invalid URL - must be from harimanga.me");
      }

      const $ = await this.fetchData(url);
      const chapters = [];

      $(".wp-manga-chapter").each((i, el) => {
        if (chapters.length >= limit) return false;

        const title = $(el).find("a").first().text().trim();
        const link = $(el).find("a").first().attr("href");
        const releaseDate =
          $(el).find(".chapter-release-date i").text().trim() || "Unknown";

        chapters.push({ title, link, releaseDate });
      });

      return chapters;
    } catch (error) {
      console.error("Chapters Error:", error);
      throw new Error("Failed to fetch chapter list");
    }
  }
}

const handler = async (m, { text, args }) => {
  const harimanga = new HarimangaScraper();
  const [command, param] = text.split("#").map((s) => s.trim());

  try {
    switch (command.toLowerCase()) {
      case "search":
        if (!param)
          return m.reply(
            "Please enter a search query\nExample: .harimanga search#romance"
          );
        const searchResults = await harimanga.search(param);
        return m.reply(
          searchResults.length > 0
            ? "🔍 Search Results:\n\n" +
                searchResults
                  .map(
                    (r, i) =>
                      `${i + 1}. *${r.title}*\n` +
                      `⭐ Rating: ${r.rating}\n` +
                      `📌 Status: ${r.status}\n` +
                      `📚 Genres: ${r.genres.join(", ")}\n` +
                      `🔗 Link: ${r.link}`
                  )
                  .join("\n\n")
            : "No results found for your search."
        );

      case "latest":
        const latestResults = await harimanga.getLatestUpdates();
        return m.reply(
          "🆕 Latest Updates:\n\n" +
            latestResults
              .map(
                (r, i) =>
                  `${i + 1}. *${r.title}*\n` +
                  `📖 Latest Chapter: ${r.latestChapter}\n` +
                  `🔗 Manga Link: ${r.link}\n` +
                  `📌 Chapter Link: ${r.chapterLink}`
              )
              .join("\n\n")
        );

      case "detail":
        if (!param)
          return m.reply(
            "Please provide a manga URL\nExample: .harimanga detail#https://harimanga.me/manga/example"
          );
        const details = await harimanga.getMangaDetails(param);
        return m.reply(
          `📚 *${details.title}*\n\n` +
            `⭐ Rating: ${details.rating}\n` +
            `🏆 Rank: ${details.rank}\n` +
            `📌 Status: ${details.status}\n` +
            `🎭 Genres: ${details.genres.join(", ")}\n` +
            `🖼️ Cover: ${details.image}`
        );

      case "chapters":
        if (!param)
          return m.reply(
            "Please provide a manga URL\nExample: .harimanga chapters#https://harimanga.me/manga/example"
          );
        const chapters = await harimanga.getChapterList(param);
        return m.reply(
          `📚 Chapter List:\n\n` +
            chapters
              .map(
                (c, i) =>
                  `${i + 1}. *${c.title}*\n` +
                  `📅 ${c.releaseDate}\n` +
                  `🔗 ${c.link}`
              )
              .join("\n\n")
        );

      default:
        return m.reply(
          "📖 Harimanga Commands:\n\n" +
            "• .harimanga search#query - Search manga\n" +
            "• .harimanga latest - Get latest updates\n" +
            "• .harimanga detail#url - Get manga details\n" +
            "• .harimanga chapters#url - Get chapter list"
        );
    }
  } catch (error) {
    console.error("Handler Error:", error);
    return m.reply(`⚠️ Error: ${error.message}`);
  }
};

handler.help = [
  "harimanga search#query - Search manga",
  "harimanga latest - Latest manga updates",
  "harimanga detail#url - Get manga details",
  "harimanga chapters#url - Get chapter list",
];
handler.tags = ["anime", "manga"];
handler.command = /^harimanga$/i;

module.exports = handler;
