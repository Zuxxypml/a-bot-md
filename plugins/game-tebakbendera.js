const fetch = require("node-fetch");

let timeout = 120000; // 2 minutes
let rewardXP = 1000;
let ticketReward = 1;
let src;

let handler = async (m, { conn, usedPrefix }) => {
  conn.tebakbendera = conn.tebakbendera ? conn.tebakbendera : {};
  let id = m.chat;

  if (id in conn.tebakbendera) {
    conn.reply(
      m.chat,
      "⚠️ There is still an unanswered flag question in this chat.",
      conn.tebakbendera[id][0]
    );
    throw false;
  }

  if (!src)
    src = await (
      await fetch(
        global.API(
          "https://raw.githubusercontent.com",
          "/qisyana/scrape/main/flag.json"
        )
      )
    ).json();
  let json = src[Math.floor(Math.random() * src.length)];
  if (!json) throw "Error fetching flag data.";

  let caption = `
⏳ Timeout: *${(timeout / 1000).toFixed(2)} seconds*
💡 Type *${usedPrefix}tbhint* for a hint
🏆 Bonus: *${rewardXP} XP*
🎟️ Limit: *+${ticketReward} Ticket*
`.trim();

  conn.tebakbendera[id] = [
    await conn.sendFile(m.chat, json.img, "flag.jpg", caption, m),
    json,
    rewardXP,
    setTimeout(() => {
      if (conn.tebakbendera[id]) {
        conn.reply(
          m.chat,
          `⏰ Time's up!\nThe correct answer was: *${json.name}*`,
          conn.tebakbendera[id][0]
        );
        delete conn.tebakbendera[id];
      }
    }, timeout),
  ];
};

handler.help = ["guessflag"];
handler.tags = ["game"];
handler.command = /^guessflag|tebakbendera$/i;
handler.limit = true;
handler.game = true;
handler.group = true;

module.exports = handler;
