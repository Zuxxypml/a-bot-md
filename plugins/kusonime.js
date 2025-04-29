const axios = require("axios");
const cheerio = require("cheerio");

class KusonimeScraper {
  constructor() {
    this.baseUrl = "https://kusonime.com";
  }

  async search(query) {
    try {
      const { data } = await axios.get(
        `${this.baseUrl}/?s=${encodeURIComponent(query)}&post_type=post`,
        {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          },
        }
      );
      const $ = cheerio.load(data);

      return $(".kover")
        .map((_, element) => {
          const $element = $(element);
          return {
            title: $element.find(".episodeye a").text().trim(),
            url: $element.find(".episodeye a").attr("href"),
            thumbnail: $element.find(".thumbz img").attr("src"),
            postedBy: $element
              .find(".fa-user")
              .parent()
              .text()
              .replace("Posted by", "")
              .trim(),
            date: $element
              .find(".fa-clock-o")
              .parent()
              .text()
              .replace("Released on", "")
              .trim(),
            genres: $element
              .find(".fa-tag")
              .parent()
              .find("a")
              .map((_, el) => $(el).text().trim())
              .get(),
          };
        })
        .get();
    } catch (error) {
      console.error("Search error:", error);
      throw new Error("Failed to search anime");
    }
  }

  async getDetails(url) {
    try {
      const { data } = await axios.get(url);
      const $ = cheerio.load(data);

      // Extract anime information
      const info = {};
      $(".info p").each((_, element) => {
        const text = $(element).text().trim();
        if (text.includes(":")) {
          const [key, value] = text.split(":").map((item) => item.trim());
          info[key] = value;
        }
      });

      // Extract synopsis
      const synopsis = $(".lexot p")
        .map((_, element) => {
          const text = $(element).text().trim();
          return !text.includes("Released on") &&
            !text.includes("Credit") &&
            text.length > 0 &&
            !text.includes(":")
            ? text
            : null;
        })
        .get()
        .filter(Boolean);

      // Extract download links
      const downloadLinks = {};
      $(".smokeurlrh").each((_, element) => {
        const quality = $(element).find("strong").text().trim();
        const links = {};
        $(element)
          .find("a")
          .each((_, link) => {
            links[$(link).text().trim()] = $(link).attr("href");
          });
        downloadLinks[quality] = links;
      });

      return {
        title: $(".jdlz").text().trim(),
        thumbnail: $(".post-thumb img").attr("src"),
        views: $(".viewoy").text().trim(),
        info,
        synopsis,
        downloadLinks,
      };
    } catch (error) {
      console.error("Detail error:", error);
      throw new Error("Failed to fetch anime details");
    }
  }
}

const kusonime = new KusonimeScraper();

const handler = async (m, { conn, args, usedPrefix, command }) => {
  try {
    if (command === "kusonime") {
      const query = args.join(" ");
      if (!query) {
        return m.reply(
          `🔍 Please provide anime title\nUsage: ${usedPrefix}kusonime <title>`
        );
      }

      await m.reply("⏳ Searching anime...");
      const results = await kusonime.search(query);

      if (!results.length) {
        return m.reply("❌ No anime found for your search");
      }

      let message = "🎬 *Search Results*\n\n";
      results.slice(0, 5).forEach((anime, i) => {
        message += `${i + 1}. *${anime.title}*\n`;
        message += `📅 ${anime.date} | 👤 ${anime.postedBy}\n`;
        message += `🏷️ ${anime.genres.join(", ")}\n`;
        message += `🔗 ${anime.url}\n\n`;
      });

      message += `Use ${usedPrefix}kusonime-detail <url> for more info`;
      await m.reply(message);
    } else if (command === "kusonime-detail") {
      const url = args[0];
      if (!url) {
        return m.reply(
          `🔗 Please provide anime URL\nUsage: ${usedPrefix}kusonime-detail <url>`
        );
      }

      await m.reply("⏳ Fetching anime details...");
      const details = await kusonime.getDetails(url);

      let caption = `🎬 *${details.title}*\n\n`;
      caption += `👁️ Views: ${details.views}\n\n`;
      caption += `ℹ️ *Information*\n`;
      for (const [key, value] of Object.entries(details.info)) {
        caption += `• ${key}: ${value}\n`;
      }

      caption += `\n📜 *Synopsis*\n${details.synopsis.join("\n")}\n\n`;
      caption += `📥 *Download Links*\n`;

      for (const [quality, links] of Object.entries(details.downloadLinks)) {
        caption += `\n${quality}:\n`;
        for (const [host, url] of Object.entries(links)) {
          caption += `- ${host}: ${url}\n`;
        }
      }

      await conn.sendMessage(
        m.chat,
        {
          image: { url: details.thumbnail },
          caption: caption.trim(),
        },
        { quoted: m }
      );
    }
  } catch (error) {
    console.error("Handler error:", error);
    await m.reply(`❌ Error: ${error.message}`);
  }
};

handler.help = [
  "kusonime <title> - Search anime",
  "kusonime-detail <url> - Get anime details",
];
handler.tags = ["anime"];
handler.command = /^(kusonime|kusonime-detail)$/i;

module.exports = handler;
