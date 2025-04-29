let handler = async (m, { conn, isOwner }) => {
  if (!isOwner)
    return m.reply("This command can only be used by the bot owner.");

  let blockedUsers = conn.blocklist
    .map((v) => v.replace(/[^0-9]/g, "") + "@s.whatsapp.net")
    .filter((v) => v !== conn.user.jid);

  if (blockedUsers.length === 0) {
    return m.reply("There are currently no blocked users.");
  }

  let listMessage =
    `╔ *Blocked Users List*\n` +
    blockedUsers
      .map((v, i) => `║ ${i + 1}. @${v.replace(/@.+/, "")}`)
      .join("\n") +
    `\n╚ Total: ${blockedUsers.length} user(s) ════`;

  conn.reply(m.chat, listMessage, m, {
    contextInfo: {
      mentionedJid: blockedUsers,
    },
  });
};

handler.help = ["blocklist"];
handler.tags = ["owner"];
handler.command = /^(blocklist|listblock|blist)$/i;
handler.owner = true;

module.exports = handler;
