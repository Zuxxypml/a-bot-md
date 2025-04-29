let handler = async (m, { conn, participants }) => {
  // Get and format premium users list
  let premiumUsers = global.prems
    .map((v) => v.replace(/[^0-9]/g, "") + "@s.whatsapp.net")
    .filter((v) => v !== conn.user.jid);

  // Handle empty list case
  if (premiumUsers.length === 0) {
    return conn.reply(m.chat, "There are currently no premium users.", m);
  }

  let message =
    `*PREMIUM USERS LIST*\n\n` +
    `Total: ${premiumUsers.length}\n\n` +
    premiumUsers
      .map((v, i) => {
        const userData = global.db.data.users[v] || {};
        const name = userData.name || "Unregistered User";
        const isInChat = participants.some((p) => v === p.jid);
        const phoneNumber = v.split("@")[0];
        const expiryDate = userData.premdate || 0;
        const status =
          expiryDate < Date.now()
            ? "Expired"
            : `Active (Expires in: ${conn.msToDate(expiryDate - Date.now())})`;

        return `${i + 1}. ${
          isInChat ? `📱 [${name}](https://wa.me/${phoneNumber})` : `👤 ${name}`
        }\n   • Status: ${status}`;
      })
      .join("\n\n");

  await conn.reply(m.chat, message, m, {
    contextInfo: {
      mentionedJid: premiumUsers,
      // Add externalAdReply for better presentation (optional)
      externalAdReply: {
        title: "Premium Users List",
        body: `Total: ${premiumUsers.length}`,
        thumbnail: await (
          await fetch("https://i.imgur.com/8Km9tLL.png")
        ).buffer(),
      },
    },
  });
};

handler.help = ["premiumlist"];
handler.tags = ["owner", "premium"];
handler.command = /^(listprem(ium)?|prem(ium)?list|premiumusers)$/i;
handler.owner = true;

module.exports = handler;
