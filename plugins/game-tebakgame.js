const fetch = require("node-fetch");

let timeout = 180000; // 3 minutes
let rewardXP = 1000;
let ticketReward = 1;

let handler = async (m, { conn, usedPrefix }) => {
  conn.tebakgame = conn.tebakgame ? conn.tebakgame : {};
  let id = m.chat;

  if (id in conn.tebakgame) {
    conn.reply(
      m.chat,
      "⚠️ There is still an unanswered game running in this chat.",
      conn.tebakgame[id][0]
    );
    throw false;
  }

  let src = await (
    await fetch(
      "https://raw.githubusercontent.com/qisyana/scrape/main/tebakgame.json"
    )
  ).json();
  let json = src[Math.floor(Math.random() * src.length)];

  if (!json) throw "❌ Error fetching the game data.";

  let caption = `
⏳ Timeout: *${(timeout / 1000).toFixed(2)} seconds*
💡 Type *${usedPrefix}tghint* for a hint
🏆 Bonus: *${rewardXP} XP*
🎟️ Limit: *+${ticketReward} ticket*
`.trim();

  conn.tebakgame[id] = [
    await conn.sendFile(m.chat, json.img, "tebakgame.jpg", caption, m, false, {
      thumbnail: Buffer.alloc(0),
    }),
    json,
    rewardXP,
    setTimeout(() => {
      if (conn.tebakgame[id]) {
        conn.reply(
          m.chat,
          `⏰ Time's up!\nThe correct answer was: *${json.jawaban}*`,
          conn.tebakgame[id][0]
        );
        delete conn.tebakgame[id];
      }
    }, timeout),
  ];
};

handler.help = ["guessgame"];
handler.tags = ["game"];
handler.command = /^guessgame|tebakgame$/i;
handler.limit = true;
handler.game = true;
handler.group = true;

module.exports = handler;
