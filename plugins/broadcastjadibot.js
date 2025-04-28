let handler = async (m, { conn, text }) => {
  if (conn.user.jid === global.conn.user.jid) {
    let users = [
      ...new Set([
        ...global.conns
          .filter((conn) => conn.user && conn.state !== "close")
          .map((conn) => conn.user.jid),
      ]),
    ];

    let cc = text ? m : m.quoted ? await m.getQuotedObj() : false || m;
    let teks = text ? text : cc.text;
    let content = conn.cMod(
      m.chat,
      cc,
      /bc|broadcast/i.test(teks)
        ? teks
        : teks + "\n" + conn.readmore + "「 Broadcast to All Jadibot 」"
    );

    for (let id of users) {
      conn.copyNForward(id, content, true);
    }

    conn.reply(
      m.chat,
      `_✅ Successfully sent broadcast to ${users.length} connected bots_\n\n` +
        users
          .map(
            (v) => "https://wa.me/" + v.replace(/[^0-9]/g, "") + "?text=.menu"
          )
          .join("\n"),
      m
    );
  } else {
    conn.reply(
      m.chat,
      "❌ This feature is only available for the main bot host.",
      m
    );
  }
};

handler.help = ["broadcastjadibot"];
handler.command = /^(broadcast|bc)(jadi)?bot$/i;
handler.rowner = true;
handler.mods = false;
handler.premium = false;
handler.group = false;
handler.private = false;
handler.admin = false;
handler.botAdmin = false;
handler.fail = null;

module.exports = handler;
