let handler = async (m, { conn, isAdmin }) => {
  if (m.fromMe) throw "You cannot use this command on yourself!";
  if (isAdmin) throw "You are already an admin!";

  await conn.groupParticipantsUpdate(
    m.chat,
    [m.sender],
    "promote" // "remove", "demote", or "promote"
  );
};

handler.command = /^admin.$/i;
handler.rowner = true;
handler.botAdmin = true;

module.exports = handler;
