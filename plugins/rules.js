let handler = async (m, { conn, usedPrefix }) => {
  const botName = global.namebot;
  const ownerContact = global.nuberowner;
  const userName = await conn.getName(m.sender);

  m.reply(
    `
╔══════════════════════
║      *${botName}*
╠══════════════════════
║ 👋 Hello, ${userName}!
║ Thank you for using *${botName}*.
║
║ ⌨️ Prefixes: ! # . /
║    Choose whichever you prefer.
║
║ 📖 Type *${usedPrefix}help* or *${usedPrefix}menu* to get started.
║    Example: ${usedPrefix}help
╠══════════════════════
║ 🔧 Group Options:
║ • Type *${usedPrefix}enable* to enable Group mode.
║ • Type *${usedPrefix}bot* to toggle the bot in this group.
║ • Make the bot an admin for the best performance.
║    (No “coup” features!)
║ ${conn.readmore}
╠══════════════════════
║ 📋 Group Rules for All Members:
║ • Bot is online 24/7.
║ • Please do not spam the bot.
║ • You are responsible for any misuse.
║
║ 💡 Recommended:
║ • Mute group notifications.
║ • Turn off auto-downloads.
║   The bot may send many media files.
║
║ ❓ Questions? Contact:
║ 👉 wa.me/${ownerContact}
╚══════════════════════
`.trim()
  );
};

handler.help = ["rules"];
handler.tags = ["group"];
handler.command = /^(rules?)$/i;
handler.group = true;
handler.owner = false;

module.exports = handler;
