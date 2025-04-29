/*
*[Playstore Plugin]* 
By Fruatre
wa.me/6285817597752
Channel: https://whatsapp.com/channel/0029VaNR2B6BadmioY6mar3N
*/

const axios = require("axios");
const cheerio = require("cheerio");

let handler = async (m, { conn, text }) => {
  if (!text) throw "🔍 What app are you looking for?";

  m.reply("🔄 Please wait, searching the Play Store...");

  let results = await PlayStoreScraper.search(text);
  if (results.error) throw results.error;

  let replyText = results
    .map(
      (v) =>
        `📱 *App Name:* ${v.nama}\n👤 *Developer:* ${v.developer}\n⭐ *Rating:* ${v.rate}\n📊 *Additional Rating:* ${v.rate2}\n🔗 *App Link:* ${v.link}\n👨‍💻 *Dev Link:* ${v.link_dev}`
    )
    .join("\n\n──────────────────────\n\n");

  m.reply(replyText);
};

handler.help = ["playstore <app name>"];
handler.tags = ["internet"];
handler.command = /^(playstore)$/i;
handler.limit = true;

module.exports = handler;

// Scraper class
class PlayStoreScraper {
  static async search(query) {
    try {
      const { data } = await axios.get(
        `https://play.google.com/store/search?q=${encodeURIComponent(
          query
        )}&c=apps`
      );
      const results = [];
      const $ = cheerio.load(data);

      $(".ULeU3b > .VfPpkd-WsjYwc").each((_, el) => {
        const linkPath = $(el).find("a").attr("href");
        const nama = $(el).find(".DdYX5").text();
        const developer = $(el).find(".wMUdtb").text();
        const img = $(el).find("img").attr("src");
        const rate = $(el).find(".ubGTjb > div").attr("aria-label");
        const rate2 = $(el).find(".w2kbF").text();
        const link = `https://play.google.com${linkPath}`;

        results.push({
          link,
          nama: nama || "No Name",
          developer: developer || "Unknown Developer",
          img: img || "https://i.ibb.co/G7CrCwN/404.png",
          rate: rate || "No Rating",
          rate2: rate2 || "No Rating",
          link_dev: `https://play.google.com/store/apps/developer?id=${developer.replace(
            /\s+/g,
            "+"
          )}`,
        });
      });

      if (!results.length)
        return { error: "❌ No results found on the Play Store." };
      return results;
    } catch (err) {
      console.error(err);
      return { error: "❌ Failed to retrieve data from Play Store." };
    }
  }
}
