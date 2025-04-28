let handler = async (m, { conn, text }) => {
  let teks = text ? text : m.quoted ? m.quoted.text : m.text;
  if (!teks) return m.reply("Please provide text to broadcast.");

  let chats = conn.chats
    .all()
    .filter((v) => !v.read_only && v.message && !v.archive)
    .map((v) => v.jid);
  let content = await conn.cMod(
    m.chat,
    m,
    teks + "\n「 Broadcast to All Chats 」"
  );

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  for (let id of chats) {
    await conn.copyNForward(id, content, true);
    await delay(2000); // 2 seconds delay between each broadcast
  }

  conn.reply(
    m.chat,
    `✅ Broadcast successfully sent to ${chats.length} chats.`,
    m
  );
};

handler.help = ["broadcastdelay"];
handler.tags = ["owner"];
handler.command = /^(b(road)?c(ast)?(time|delay))$/i;

handler.owner = true;
handler.mods = false;
handler.premium = false;
handler.group = false;
handler.private = false;
handler.admin = false;
handler.botAdmin = false;
handler.fail = null;

module.exports = handler;
