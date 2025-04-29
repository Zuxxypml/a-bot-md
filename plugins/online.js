const handler = async (m, { conn }) => {
  const chatID = m.chat;
  const onlineMembers = [];

  const metadata = await conn.groupMetadata(chatID);

  for (const participant of metadata.participants) {
    if (participant.id && participant.id.includes("@s.whatsapp.net")) {
      // Get name using conn.getName
      const name = await conn.getName(participant.id);
      onlineMembers.push(
        `│ ○ Name: ${name}\n│ wa.me/${participant.id.split("@")[0]}`
      );
    }
  }

  if (onlineMembers.length > 0) {
    const list = onlineMembers.join("\n");
    conn.reply(
      chatID,
      `╭───「 *ONLINE LIST* 」───⬣\n│ *Participants currently online or present:*\n│\n${list}\n╰──── •`,
      m,
      {
        contextInfo: { mentionedJid: metadata.participants.map((p) => p.id) },
      }
    );
  } else {
    m.reply("No members are currently online.");
  }
};

handler.help = ["here", "listonline"];
handler.tags = ["group"];
handler.command = /^(here|(list)?online)$/i;
handler.group = true;
handler.admin = true;
handler.limit = true;

module.exports = handler;
