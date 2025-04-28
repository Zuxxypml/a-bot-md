let handler = async (m, { conn }) => {
  conn.asahotak = conn.asahotak ? conn.asahotak : {};
  let id = m.chat;
  if (!(id in conn.asahotak)) throw false;
  let json = conn.asahotak[id][1];
  let answer = json.result.jawaban;
  let hint = answer.replace(/[AIUEOaiueo]/g, "_");
  m.reply("```" + hint + "```");
};

handler.command = /^hintasah$/i;
handler.limit = true;

module.exports = handler;
