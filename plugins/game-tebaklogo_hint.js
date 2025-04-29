let handler = async (m, { conn }) => {
  conn.tebaklogo = conn.tebaklogo ? conn.tebaklogo : {};
  let id = m.chat;

  if (!(id in conn.tebaklogo)) throw false;

  let json = conn.tebaklogo[id][1];
  let clue = json.jawaban.replace(/[AIUEOaiueo]/gi, "_");

  conn.reply(
    m.chat,
    "```" + clue + "```\n(Reply to the original question, not this hint.)",
    m
  );
};

handler.command = /^hlog$/i;
handler.limit = true;

module.exports = handler;
