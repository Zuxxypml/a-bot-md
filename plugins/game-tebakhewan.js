const fetch = require("node-fetch");
const cheerio = require("cheerio");
const path = require("path");

let timeout = 120000; // 2 minutes
let rewardXP = 1000;

let handler = async (m, { conn, command, usedPrefix }) => {
  conn.tebakhewan = conn.tebakhewan ? conn.tebakhewan : {};
  let id = m.chat;

  if (id in conn.tebakhewan) {
    conn.reply(
      m.chat,
      "⚠️ There is still an unanswered animal guessing game running here.",
      conn.tebakhewan[id][0]
    );
    throw false;
  }

  let src = await getAnimalData();
  let json = src[Math.floor(Math.random() * src.length)];

  if (!json) throw "❌ Error fetching animal data.";

  let caption = `
🐾 *GUESS THE ANIMAL* 🐾
What animal is this?

⏳ Timeout: *${(timeout / 1000).toFixed(2)} seconds*
💡 Type *${usedPrefix}hhew* for a hint
🏆 Bonus: *${rewardXP} XP*
`.trim();

  conn.tebakhewan[id] = [
    await conn.sendFile(m.chat, json.url, "", caption, m),
    json,
    rewardXP,
    setTimeout(() => {
      if (conn.tebakhewan[id]) {
        conn.reply(
          m.chat,
          `⏰ Time's up!\nThe correct answer was: *${json.title}*`,
          conn.tebakhewan[id][0]
        );
        delete conn.tebakhewan[id];
      }
    }, timeout),
  ];
};

handler.help = ["guessanimal"];
handler.tags = ["game"];
handler.command = ["guessanimal", "tebakhewan"];
handler.game = true;
handler.group = true;

module.exports = handler;

async function getAnimalData() {
  const randomPageNumber = Math.floor(Math.random() * 20) + 1;
  const url = `https://rimbakita.com/daftar-nama-hewan-lengkap/${randomPageNumber}/`;

  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    return $(
      "div.entry-content.entry-content-single img[class*=wp-image-][data-src]"
    )
      .map((_, element) => {
        const src = $(element).attr("data-src");
        const alt = path.basename(src, path.extname(src)).replace(/-/g, " ");
        const capitalizedAlt = alt.charAt(0).toUpperCase() + alt.slice(1);
        return { title: capitalizedAlt, url: src };
      })
      .get();
  } catch (error) {
    console.error("Error fetching animal list:", error);
    return [];
  }
}
