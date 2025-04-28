let handler = async (m, { conn, isAdmin, isOwner }) => {
  if (m.isGroup) {
    if (!(isAdmin || isOwner)) {
      dfail("admin", m, conn);
      throw false;
    }
  }
  let id = m.chat;
  conn.absen = conn.absen || {};
  if (!(id in conn.absen))
    return await conn.sendButton(
      m.chat,
      `There is no active attendance session!`,
      wm,
      "Start Attendance",
      `.startattendance`,
      m
    );

  delete conn.absen[id];
  m.reply(`Successfully deleted the attendance session!`);
};

handler.help = ["-attendance"];
handler.tags = ["attendance"];
handler.command = /^(delete|hapus|-)(attendance|absen)$/i;

module.exports = handler;
