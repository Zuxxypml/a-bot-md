let handler = async (m, { conn }) => {
  conn.tebakgame = conn.tebakgame ? conn.tebakgame : {};
  let id = m.chat;

  if (!(id in conn.tebakgame)) throw false;

  let json = conn.tebakgame[id][1];
  let answer = json.jawaban.trim();
  let clue = answer.replace(/[AIUEOaiueo]/g, "_");

  conn.reply(
    m.chat,
    "```" + clue + "```\nReply to the original question, not this hint.",
    conn.tebakgame[id][0]
  );
};

handler.command = /^tghint$/i;
handler.limit = true;

module.exports = handler;
