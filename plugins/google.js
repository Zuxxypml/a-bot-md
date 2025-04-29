const axios = require("axios");
const cheerio = require("cheerio");
const https = require("https");

// User agents for rotation
const userAgents = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1",
];

const handler = async (m, { conn, args, usedPrefix, command }) => {
  // Validate input
  let query;
  if (args.length >= 1) {
    query = args.join(" ");
  } else if (m.quoted?.text) {
    query = m.quoted.text;
  } else {
    const example = `${usedPrefix}${command} JavaScript documentation`;
    return m.reply(`Please provide a search query!\nExample: *${example}*`);
  }

  try {
    // Show loading message
    const waitMsg = await m.reply("🔍 Searching Google... Please wait...");

    // Perform search
    const results = await googleSearch(query, 5); // Get top 5 results

    if (results.length === 0) {
      await conn.sendMessage(m.chat, { delete: waitMsg.key });
      return m.reply("No results found for your search query.");
    }

    // Format results
    let response =
      `*Google Search Results*\n\n` +
      `🔎 *Query:* ${query}\n\n` +
      results
        .map(
          (result, index) =>
            `*${index + 1}. ${result.title}*\n` +
            `🌐 ${result.url}\n` +
            `📝 ${result.description}\n`
        )
        .join("\n") +
      `\nℹ️ Showing top ${results.length} results`;

    // Send results
    await conn.sendMessage(
      m.chat,
      {
        text: response,
        contextInfo: {
          externalAdReply: {
            title: "Google Search Results",
            body: query.length > 30 ? query.substring(0, 30) + "..." : query,
            thumbnailUrl:
              "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
            sourceUrl: `https://www.google.com/search?q=${encodeURIComponent(
              query
            )}`,
          },
        },
      },
      { quoted: m }
    );

    // Delete loading message
    await conn.sendMessage(m.chat, { delete: waitMsg.key });
  } catch (error) {
    console.error("Google Search Error:", error);
    m.reply("⚠️ Failed to perform search. Please try again later.");
  }
};

// Helper functions
function getRandomUserAgent() {
  return userAgents[Math.floor(Math.random() * userAgents.length)];
}

async function googleSearch(query, limit = 5, lang = "en") {
  try {
    const { data } = await axios.get("https://www.google.com/search", {
      headers: {
        "User-Agent": getRandomUserAgent(),
        "Accept-Language": `${lang},en;q=0.9`,
      },
      params: {
        q: query,
        num: limit + 2, // Get extra in case some results are invalid
        hl: lang,
      },
      timeout: 10000,
    });

    const $ = cheerio.load(data);
    const results = [];

    $("div.g").each((i, el) => {
      if (results.length >= limit) return false;

      const title = $(el).find("h3").text();
      const url = $(el).find("a").attr("href");
      const description =
        $(el).find('div[style="-webkit-line-clamp:2"]').text() ||
        $(el).find(".VwiC3b").text();

      if (title && url && !url.startsWith("/search?") && description) {
        results.push({
          title: title.trim(),
          url: cleanGoogleUrl(url),
          description: description.trim(),
        });
      }
    });

    return results;
  } catch (error) {
    console.error("Search Error:", error);
    throw error;
  }
}

function cleanGoogleUrl(url) {
  try {
    const decodedUrl = decodeURIComponent(url);
    const match = decodedUrl.match(/q=([^&]+)/);
    return match ? match[1] : url;
  } catch {
    return url;
  }
}

// Command configuration
handler.help = ["google <query> - Search Google"];
handler.tags = ["internet", "tools"];
handler.command = /^google|gsearch$/i;
handler.limit = true;

module.exports = handler;
