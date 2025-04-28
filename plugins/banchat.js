let handler = async (m, { conn, participants }) => {
  if (conn.user.jid !== global.conn.user.jid) {
    if (participants.map((v) => v.id).includes(global.conn.user.jid))
      throw `Cannot ban this chat because the master bot is present.`;
  }
  global.db.data.chats[m.chat].isBanned = true;
  m.reply(
    "_*This chat has been banned.*_\nThe bot will no longer respond here.\n\nContact the Owner to unban."
  );
};

handler.help = ["banchat"];
handler.tags = ["owner"];
handler.command = /^banchat$/i;
handler.owner = true;

module.exports = handler;
