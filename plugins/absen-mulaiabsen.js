let handler = async (m, { conn, text, isAdmin, isOwner }) => {
  if (m.isGroup) {
    if (!(isAdmin || isOwner)) {
      dfail("admin", m, conn);
      throw 0;
    }
  }
  conn.absen = conn.absen || {};
  let id = m.chat;
  if (id in conn.absen) {
    await conn.reply(
      m.chat,
      `There is still an ongoing attendance session!\n.deleteattendance\n.checkattendance`,
      m
    );
    throw false;
  }
  conn.absen[id] = [
    await conn.reply(m.chat, `Attendance has started!\n.attendance`, m),
    [],
    text,
  ];
};

handler.help = ["+attendance [text]"];
handler.tags = ["attendance"];
handler.command = /^(start|mulai|\+)(attendance|absen)$/i;

module.exports = handler;
