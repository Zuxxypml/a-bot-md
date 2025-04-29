let handler = async (m, { conn }) => {
  conn.tebakhewan = conn.tebakhewan ? conn.tebakhewan : {};
  let id = m.chat;

  if (!(id in conn.tebakhewan)) throw false;

  let json = conn.tebakhewan[id][1];
  let clue = json.title.replace(/[AIUEOaiueo]/gi, "_");

  conn.reply(
    m.chat,
    "```" + clue + "```\n(Reply to the original question, not this hint)",
    m
  );
};

handler.command = /^hhew$/i;
handler.limit = true;

module.exports = handler;
