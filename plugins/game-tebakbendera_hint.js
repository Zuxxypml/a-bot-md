let handler = async (m, { conn }) => {
  conn.tebakbendera = conn.tebakbendera ? conn.tebakbendera : {};
  let id = m.chat;

  if (!(id in conn.tebakbendera)) throw false;

  let json = conn.tebakbendera[id][1];
  let answer = json.name.trim();
  let clue = answer.replace(/[AIUEOaiueo]/g, "_");

  conn.reply(
    m.chat,
    "```" + clue + "```\nReply to the original question, not this hint.",
    conn.tebakbendera[id][0]
  );
};

handler.command = /^tbhint$/i;
handler.limit = true;

module.exports = handler;
