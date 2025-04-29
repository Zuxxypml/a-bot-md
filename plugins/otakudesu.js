const axios = require("axios");
const cheerio = require("cheerio");

const searchHeader = "Search Results:";
const episodeHeader = "Episode List:";
const downloadHeader = "Download Links:";
const separator = "========================";

const baseUrl = "https://otakudesu.cloud";

// ✅ Latest Anime Function
async function latestAnime() {
  try {
    const url = `${baseUrl}/ongoing-anime/`;
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    let animeList = [];

    $(".venz ul li").each((i, elem) => {
      const title = $(elem).find("h2.jdlflm").text().trim();
      const episode = $(elem)
        .find(".epz")
        .text()
        .replace("Episode ", "")
        .trim();
      const releaseDay = $(elem).find(".epztipe").text().trim();
      const releaseDate = $(elem).find(".newnime").text().trim();
      const image = $(elem).find(".thumbz img").attr("src");
      const link = $(elem).find(".thumb a").attr("href");
      animeList.push({ title, episode, releaseDay, releaseDate, image, link });
    });

    return animeList;
  } catch (error) {
    console.error("Error in latestAnime:", error);
    return { error: "Failed to fetch latest anime." };
  }
}

// ✅ Anime Detail Function
async function animeDetail(url) {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const title = $("title").text().split("|")[0].trim();
    const description = $('meta[name="description"]').attr("content");
    const image = $('meta[property="og:image"]').attr("content");
    const publishedTime = $('meta[property="article:published_time"]').attr(
      "content"
    );
    const modifiedTime = $('meta[property="article:modified_time"]').attr(
      "content"
    );

    const titleJapanese = $('p:contains("Japanese")')
      .text()
      .replace(/^Japanese\s*:\s*/, "")
      .trim();
    const score = $('p:contains("Skor")')
      .text()
      .replace(/^Skor\s*:\s*/, "")
      .trim();
    const rating = $('p:contains("Rating")')
      .text()
      .replace(/^Rating\s*:\s*/, "")
      .trim();
    const producer = $('p:contains("Produser")')
      .text()
      .replace(/^Produser\s*:\s*/, "")
      .trim();
    const type = $('p:contains("Tipe")')
      .text()
      .replace(/^Tipe\s*:\s*/, "")
      .trim();
    const status = $('p:contains("Status")')
      .text()
      .replace(/^Status\s*:\s*/, "")
      .trim();
    const totalEpisodes = $('p:contains("Total Episode")')
      .text()
      .replace(/^Total Episode\s*:\s*/, "")
      .trim();
    const duration = $('p:contains("Durasi")')
      .text()
      .replace(/^Durasi\s*:\s*/, "")
      .trim();
    const releaseDate = $('p:contains("Tanggal Rilis")')
      .text()
      .replace(/^Tanggal Rilis\s*:\s*/, "")
      .trim();
    const studio = $('p:contains("Studio")')
      .text()
      .replace(/^Studio\s*:\s*/, "")
      .trim();
    const genres = $('p:contains("Genre") a')
      .map((i, el) => $(el).text().trim())
      .get()
      .join(", ");
    const synopsis = $(".sinopc p")
      .map((i, el) => $(el).text().trim())
      .get()
      .join(" ");

    return {
      title,
      titleJapanese,
      description,
      image,
      publishedTime,
      modifiedTime,
      score,
      rating,
      producer,
      type,
      status,
      totalEpisodes,
      duration,
      releaseDate,
      studio,
      genres,
      synopsis,
      url,
    };
  } catch (error) {
    console.error("Error in animeDetail:", error);
    return { error: "Failed to retrieve anime details." };
  }
}

// ✅ Search Function
async function searchAnime(query) {
  try {
    const searchUrl = `${baseUrl}/?s=${encodeURIComponent(
      query
    )}&post_type=anime`;
    const { data } = await axios.get(searchUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    const $ = cheerio.load(data);
    const results = [];

    $(".chivsrc > li").each((i, el) => {
      const image = $(el).find("img").attr("src");
      const title = $(el).find("h2 a").text().trim();
      const url = $(el).find("h2 a").attr("href");
      const genres = [];
      $(el)
        .find(".set")
        .eq(0)
        .find("a")
        .each((_, genre) => {
          genres.push($(genre).text().trim());
        });
      const status = $(el)
        .find(".set")
        .eq(1)
        .text()
        .replace(/^Status\s*:\s*/, "")
        .trim();
      const rating = $(el)
        .find(".set")
        .eq(2)
        .text()
        .replace(/^Rating\s*:\s*/, "")
        .trim();

      if (title && url) {
        results.push({ title, url, image, genres, status, rating });
      }
    });

    return results;
  } catch (error) {
    console.error("Error in searchAnime:", error);
    return { error: "Failed to perform search. Try again later." };
  }
}

// ✅ Episode List
async function episodeData(url) {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const episodes = [];

    $(".episodelist ul li").each((index, el) => {
      const title = $(el).find("a").text().trim();
      const url = $(el).find("a").attr("href");
      const date = $(el).find(".zeebr").text().trim();
      episodes.push({ title, url, date });
    });

    return {
      title: $(".monktit").text().trim(),
      episodes,
    };
  } catch (error) {
    console.error("Error in episodeData:", error);
    return null;
  }
}

// ✅ Video Stream (if embeddable)
async function videoData(url) {
  try {
    const { data } = await axios.get(url);
    const regex = /sources:\s*(\[[^\]]+\])/;
    const match = data.match(regex);
    if (match) {
      const sources = JSON.parse(match[1]);
      return sources[0].file;
    } else {
      throw new Error("Video source not found.");
    }
  } catch (error) {
    console.error("Error in videoData:", error);
    throw error;
  }
}

// ✅ Download Links
async function linkDownloadData(url) {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const iframeSrc = $("#lightsVideo iframe").attr("src");
    const episodes = $(".download li")
      .map((i, el) => {
        const title = $(el).find("strong").text();
        const links = $(el)
          .find("a")
          .map((i, a) => ({
            text: $(a).text().trim(),
            url: $(a).attr("href"),
          }))
          .get();
        const size = $(el).find("i").text().trim();
        return { title, links, size };
      })
      .get();

    return {
      title: $("h4").text().trim(),
      frame: iframeSrc,
      episodes,
    };
  } catch (error) {
    console.error("Error in linkDownloadData:", error);
    return null;
  }
}

// ✅ Main Handler
const handler = async (m, { conn, command, args }) => {
  if (command === "otakudesu") {
    if (!args.length) {
      return m.reply(`Use format:
- *otakudesu latest* → Latest anime
- *otakudesu search <title>* → Search anime
- *otakudesu detail <url>* → Show anime detail
- *otakudesu episode <url>* → Episode list
- *otakudesu download <url>* → Download links
- *otakudesu video <url>* → Stream anime`);
    }

    if (args[0] === "latest") {
      const data = await latestAnime();
      if (data.error) return m.reply(data.error);

      let message = "📺 Latest Anime:\n\n";
      data.slice(0, 10).forEach((anime, i) => {
        message += `${i + 1}. ${anime.title}\nEpisode: ${
          anime.episode
        }\nReleased: ${anime.releaseDate}\nLink: ${anime.link}\n\n`;
      });
      return m.reply(message);
    } else if (args[0] === "search") {
      if (!args[1]) return m.reply("Enter a title to search.");
      const data = await searchAnime(args.slice(1).join(" "));
      if (data.error) return m.reply(data.error);

      let message = "🔍 Search Results:\n\n";
      data.slice(0, 10).forEach((anime, i) => {
        message += `${i + 1}. ${anime.title}\nStatus: ${
          anime.status
        }\nRating: ${anime.rating}\nLink: ${anime.url}\n\n`;
      });
      return m.reply(message);
    } else if (args[0] === "detail") {
      if (!args[1]) return m.reply("Provide the anime detail URL.");
      const data = await animeDetail(args[1]);
      if (data.error) return m.reply(data.error);

      const caption = `*Title:* ${data.title}
*Japanese:* ${data.titleJapanese}
*Score:* ${data.score}
*Studio:* ${data.studio}
*Release Date:* ${data.releaseDate}
*Episodes:* ${data.totalEpisodes}
*Genres:* ${data.genres}
*Synopsis:* ${data.synopsis.slice(0, 500)}...
🔗 *Link:* ${data.url}`;

      return await conn.sendMessage(
        m.chat,
        { image: { url: data.image }, caption },
        { quoted: m }
      );
    } else if (args[0] === "episode") {
      const result = await episodeData(args[1]);
      if (!result || !result.episodes.length)
        return m.reply("No episodes found.");

      let msg =
        `${episodeHeader} for *${result.title}*\n${separator}\n` +
        result.episodes
          .map((ep) => `📺 ${ep.title}\n🔗 ${ep.url}\n📅 ${ep.date}`)
          .join(`\n${separator}\n`);
      return m.reply(msg);
    } else if (args[0] === "download") {
      const result = await linkDownloadData(args[1]);
      if (!result) return m.reply("No download links found.");

      let msg =
        `${downloadHeader} for *${result.title}*\n🔗 Stream: ${result.frame}\n${separator}\n` +
        result.episodes
          .map((ep) => {
            const links = ep.links
              .map((l) => `🔗 ${l.text}: ${l.url}`)
              .join("\n");
            return `📺 ${ep.title}\n${links}\n💾 Size: ${ep.size}`;
          })
          .join(`\n${separator}\n`);
      return m.reply(msg);
    } else if (args[0] === "video") {
      try {
        const videoUrl = await videoData(args[1]);
        return await conn.sendMessage(
          m.chat,
          {
            video: { url: videoUrl },
            mimetype: "video/mp4",
            caption: "*[ Stream Result ]*",
          },
          { quoted: m }
        );
      } catch (e) {
        return m.reply("Unable to retrieve video link.");
      }
    } else {
      return m.reply("Invalid command format.");
    }
  }
};

handler.help = ["otakudesu"];
handler.command = ["otakudesu"];
handler.tags = ["anime"];

module.exports = handler;
