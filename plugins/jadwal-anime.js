const axios = require("axios");
const cheerio = require("cheerio");

async function fetchSchedule() {
  try {
    const response = await axios.get("https://otakudesu.cloud/jadwal-rilis/", {
      timeout: 10000, // 10 second timeout
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    const $ = cheerio.load(response.data);
    const schedule = {};

    $(".kglist321").each((i, element) => {
      const day = $(element).find("h2").text().trim().toLowerCase();
      schedule[day] = [];

      $(element)
        .find("a")
        .each((i, el) => {
          schedule[day].push({
            title: $(el).text().trim(),
            link: $(el).attr("href"),
            episode:
              $(el)
                .text()
                .match(/episode\s*\d+/i)?.[0] || "Latest",
          });
        });
    });

    return schedule;
  } catch (error) {
    console.error("Scraping error:", error);
    throw new Error("Failed to fetch anime schedule. Please try again later.");
  }
}

const handler = async (m, { conn }) => {
  try {
    await m.reply("⏳ Fetching anime schedule...");

    const schedule = await fetchSchedule();
    let message = "🎬 *Anime Release Schedule*\n\n";

    for (const day in schedule) {
      if (schedule[day].length > 0) {
        message += `📅 *${day.toUpperCase()}*\n`;
        message += schedule[day]
          .map(
            (anime) =>
              `▸ ${anime.title} (${anime.episode})\n   🔗 ${anime.link}`
          )
          .join("\n\n");
        message += "\n\n";
      }
    }

    // Send as button message if available
    if (conn.sendButton) {
      return conn.sendButton(
        m.chat,
        message.trim(),
        "Powered by Otakudesu",
        null,
        [["Refresh", "/jadwalanime"]],
        m
      );
    }

    await conn.reply(m.chat, message.trim(), m);
  } catch (error) {
    console.error("Handler error:", error);
    await conn.reply(m.chat, `❌ Error: ${error.message}`, m);
  }
};

handler.help = ["jadwalanime"];
handler.tags = ["anime", "information"];
handler.command = /^(jadwalanime|animeschedule)$/i;

module.exports = handler;
