async function handler(m, { conn, usedPrefix }) {
  // Get unique active bot instances
  const activeBots = [
    ...new Set(
      global.conns
        .filter((conn) => conn.user && conn.state !== "close")
        .map((conn) => conn.user)
    ),
  ];

  if (activeBots.length === 0) {
    return conn.reply(m.chat, "No active JADI BOT instances found.", m);
  }

  // Format bot list with clickable links
  const botList = activeBots
    .map(
      (v, i) =>
        `${i + 1}. https://wa.me/${v.jid.replace(
          /[^0-9]/g,
          ""
        )}?text=${encodeURIComponent(usedPrefix)}menu @${v.jid.split("@")[0]}`
    )
    .join("\n\n");

  await conn.reply(
    m.chat,
    `*ACTIVE JADI BOT INSTANCES*\n\n` +
      `Total: ${activeBots.length}\n\n` +
      `${botList}`,
    m,
    {
      contextInfo: {
        mentionedJid: activeBots.map((v) => v.jid),
      },
    }
  );
}

handler.help = ["listjadibot"];
handler.tags = ["info", "jadibot"];
handler.command = /^(listjadibot|jadibotlist|botslist)$/i;

module.exports = handler;
