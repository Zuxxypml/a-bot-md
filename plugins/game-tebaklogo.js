const fs = require("fs");

let timeout = 120000; // 2 minutes
let rewardXP = 600;

let handler = async (m, { conn, command, usedPrefix }) => {
  conn.tebaklogo = conn.tebaklogo || {};
  let id = m.chat;

  if (id in conn.tebaklogo) {
    conn.reply(
      m.chat,
      "⚠️ There is still an unanswered logo quiz running in this chat.",
      conn.tebaklogo[id][0]
    );
    throw false;
  }

  let src = JSON.parse(fs.readFileSync("./lib/tebaklogo.json", "utf-8"));
  let json = src[Math.floor(Math.random() * src.length)];

  if (!json) throw "❌ Error loading logo data.";

  let caption = `
🏷️ *GUESS THE LOGO*
What logo is this?

⏳ Timeout: *${(timeout / 1000).toFixed(2)} seconds*
💡 Type *${usedPrefix}hlog* for a hint
🏆 Bonus: *${rewardXP} XP*
`.trim();

  conn.tebaklogo[id] = [
    await conn.sendFile(m.chat, json.img, "", caption, m),
    json,
    rewardXP,
    setTimeout(() => {
      if (conn.tebaklogo[id]) {
        conn.reply(
          m.chat,
          `⏰ Time's up!\nThe correct answer was: *${json.jawaban}*`,
          conn.tebaklogo[id][0]
        );
        delete conn.tebaklogo[id];
      }
    }, timeout),
  ];
};

handler.help = ["guesslogo", "tebaklogo"];
handler.tags = ["game"];
handler.command = /^guesslogo|tebaklogo$/i;
handler.game = true;
handler.group = true; // safer to group-only
// handler.owner = true; // you disabled this (fine)

module.exports = handler;

// Optional: button templates if you want to implement later
const buttons = [
  ["Hint", "/hlog"],
  ["Surrender", "menyerah"],
];
