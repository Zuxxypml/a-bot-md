const fetch = require("node-fetch");
const fs = require("fs");

const timeout = 30000; // 30 seconds
const poin = 700;

let handler = async (m, { conn, usedPrefix }) => {
  conn.caklontong = conn.caklontong || {};
  let id = m.chat;

  if (id in conn.caklontong) {
    if (conn.caklontong[id].length !== 0) {
      conn.reply(
        m.chat,
        "🚫 There is still an unanswered question!",
        conn.caklontong[id][0]
      );
      throw false;
    }
    delete conn.caklontong[id];
  }

  let src;
  try {
    src = JSON.parse(fs.readFileSync(`./src/scrap/caklontong.json`));
  } catch (e) {
    console.error(e);
    return m.reply("⚠️ Failed to load Cak Lontong questions.");
  }

  let json = src[Math.floor(Math.random() * src.length)];
  if (!json || !json.result) {
    return m.reply("⚠️ Unable to fetch a question.");
  }

  let caption = `
*Question:* ${json.result.question}

⏱️ Time Limit: *${(timeout / 1000).toFixed(0)} seconds*
🎁 Bonus: +${poin} XP

*Reply to this message to answer!*`.trim();

  let msg = await conn.reply(
    m.chat,
    caption +
      `\n\n*GUESS CAK LONTONG STYLE*\n⚡ WARNING: This question will test your patience, get ready to bite your fingers! 🤣`,
    m
  );

  conn.caklontong[id] = [
    msg,
    json,
    poin,
    setTimeout(() => {
      if (conn.caklontong[id]) {
        conn.reply(
          m.chat,
          `⏰ Time's up!\n\n📝 Answer: *${json.result.answer}*\n💬 Explanation: ${json.result.information}`,
          conn.caklontong[id][0]
        );
        delete conn.caklontong[id];
      }
    }, timeout),
  ];
};

handler.help = ["caklontong"];
handler.tags = ["game"];
handler.command = /^caklontong$/i;
handler.limit = false;
handler.group = true;

module.exports = handler;
