let handler = async (m, { conn, command, args }) => {
  const delay = (ms) => new Promise((r) => setTimeout(r, ms));
  let gc = conn.chats.array
    .filter((v) => v.jid.endsWith("g.us") && !v.pin)
    .map((v) => v.jid);
  let chats = conn.chats.array
    .filter((v) => v.jid.endsWith(".net") && !v.pin)
    .map((v) => v.jid);
  m.reply("_Clearing chats..._");
  for (let id of chats) {
    await conn
      .modifyChat(id, "delete", {
        includeStarred: false,
      })
      .catch(console.log);
    await delay(2000);
  }
  conn.reply(m.chat, `${chats.length} chats have been cleared`, m);
  m.reply("_Clearing group chats..._");
  for (let id of gc) {
    await conn
      .modifyChat(id, "clear", {
        includeStarred: false,
      })
      .catch(console.log);
    await delay(2000);
  }
  conn.reply(m.chat, `${gc.length} group chats have been cleared`, m);
};

handler.help = ["clear"];
handler.tags = ["mods"];
handler.command = /^(clear)$/i;
handler.mods = true;

module.exports = handler;
