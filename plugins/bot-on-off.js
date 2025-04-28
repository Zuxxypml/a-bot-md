let handler = async (m, { conn, usedPrefix, isAdmin, isOwner, text }) => {
  if (m.isGroup) {
    if (!(isAdmin || isOwner)) {
      global.dfail("admin", m, conn);
      throw false;
    }
    switch (text) {
      case "off":
        {
          global.db.data.chats[m.chat].isBanned = true;
          m.reply("✅ Bot has been *deactivated* for this group.");
        }
        break;
      case "on":
        {
          global.db.data.chats[m.chat].isBanned = false;
          m.reply(
            `✅ Bot has been *activated* for this group.\n\nYou can now type *${usedPrefix}menu* to use the bot.`
          );
        }
        break;
      default:
        {
          conn.reply(
            m.chat,
            `⚙️ Option to *activate or deactivate* the bot in the group.\n\nUsage:\n${usedPrefix}bot on\n${usedPrefix}bot off`,
            m
          );
        }
        break;
    }
  } else {
    conn.reply(
      m.chat,
      `This command is only for groups.\n\nPlease type *${usedPrefix}menu* instead.`,
      m
    );
  }
};
handler.help = ["bot [on/off]"];
handler.tags = ["group"];
handler.command = /^(bot)$/i;

module.exports = handler;
