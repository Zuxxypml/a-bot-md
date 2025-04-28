let handler = async (m, { conn }) => {
  conn.caklontong = conn.caklontong || {};
  let id = m.chat;

  if (!(id in conn.caklontong))
    throw "⚠️ No ongoing Cak Lontong question here.";

  let json = conn.caklontong[id][1];
  let answer = (json.result.answer || "").toLowerCase();

  if (!answer) throw "⚠️ No valid answer found.";

  let hint = answer.replace(/[bcdfghjklmnpqrstvwxyz]/g, "_");

  m.reply("🔎 Hint:\n```" + hint + "```");
};

handler.command = /^apasih$/i;
handler.limit = true;

module.exports = handler;
