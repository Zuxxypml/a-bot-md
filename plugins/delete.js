const handler = async (m, { conn, command, isAdmin, isOwner }) => {
  if (!(isAdmin || isOwner)) {
    global.dfail("admin", m, conn);
    throw false;
  }
  if (!m.quoted) throw "Please reply to the message you want to delete.";

  try {
    let participant = m.message.extendedTextMessage.contextInfo.participant;
    let messageId = m.message.extendedTextMessage.contextInfo.stanzaId;
    return conn.sendMessage(m.chat, {
      delete: {
        remoteJid: m.chat,
        fromMe: false,
        id: messageId,
        participant: participant,
      },
    });
  } catch {
    return conn.sendMessage(m.chat, { delete: m.quoted.vM.key });
  }
};

handler.help = ["delete"];
handler.tags = ["main"];
handler.command = /^del(ete)?$/i;
handler.botAdmin = true;

module.exports = handler;
