let fs = require("fs");
let timeout = 60000; // 60 seconds
let pointReward = 500;

let handler = async (m, { conn, usedPrefix }) => {
  conn.asahotak = conn.asahotak ? conn.asahotak : {};
  let id = m.chat;

  if (id in conn.asahotak) {
    if (conn.asahotak[id].length !== 0)
      return conn.reply(
        m.chat,
        "There is still an unanswered question in this chat.",
        conn.asahotak[id][0]
      );
    delete conn.asahotak[id];
    throw false;
  }

  conn.asahotak[id] = [];
  let src = JSON.parse(fs.readFileSync(`./src/scrap/asahotak.json`));
  let json = src[Math.floor(Math.random() * src.length)];
  let question = json.result.pertanyaan;

  let caption = `
*Question:* ${question}

Time to Answer: *${(timeout / 1000).toFixed(2)} seconds*
Reward: ${pointReward} XP
*Reply to this message to answer!*`.trim();

  let btn = await conn.reply(
    m.chat,
    caption + "\n*🧠 BRAIN TEASER*\nHint usage will cost 1 limit.",
    m
  );

  conn.asahotak[id] = [
    btn,
    json,
    pointReward,
    setTimeout(() => {
      if (conn.asahotak[id])
        conn.reply(
          m.chat,
          `⏰ Time's up!\nThe correct answer was: *${json.result.jawaban}*`,
          conn.asahotak[id][0]
        );
      conn.sendMessage(m.chat, { delete: btn.key }).catch((e) => e);
      delete conn.asahotak[id];
    }, timeout),
  ];
};

handler.help = ["asahotak"];
handler.tags = ["game"];
handler.command = /^asahotak$/i;
handler.group = true;
handler.limit = false;

module.exports = handler;
