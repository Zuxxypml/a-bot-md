let handler = async (m, { conn, usedPrefix }) => {
  let bannedChats = Object.entries(global.db.data.chats).filter(
    (chat) => chat[1].isBanned
  );
  let bannedUsers = Object.entries(global.db.data.users).filter(
    (user) => user[1].banned
  );

  m.reply(
    `
╔ *Banned Chats List*
║ Total: ${bannedChats.length} Chat${
      bannedChats.length
        ? "\n" +
          bannedChats
            .map(([jid], i) =>
              `
║ ${i + 1}. ${conn.getName(jid) || "Unknown"}
║ ${jid}
`.trim()
            )
            .join("\n")
        : ""
    }
╚════

╔ *Banned Users List*
║ Total: ${bannedUsers.length} User${
      bannedUsers.length
        ? "\n" +
          bannedUsers
            .map(([jid], i) =>
              `
║ ${i + 1}. ${conn.getName(jid) || "Unknown"}
║ ${jid}
`.trim()
            )
            .join("\n")
        : ""
    }
╚════
`.trim()
  );
};

handler.help = ["listbanned"];
handler.tags = ["info"];
handler.command = /^(listban(ned)?|ban(ned)?list|bannedlist)$/i;
module.exports = handler;
