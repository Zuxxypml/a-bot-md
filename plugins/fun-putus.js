let handler = async (m, { conn }) => {
  let user = global.db.data.users[m.sender];

  if (!user.pasangan || user.pasangan === "") {
    return conn.reply(m.chat, `You don't have a partner yet. 🤔`, m);
  }

  let partner = global.db.data.users[user.pasangan];

  if (typeof partner == "undefined") {
    conn.reply(
      m.chat,
      `Successfully ended your relationship with @${
        user.pasangan.split("@")[0]
      }`,
      m,
      {
        contextInfo: { mentionedJid: [user.pasangan] },
      }
    );
    user.pasangan = "";
    return;
  }

  if (m.sender == partner.pasangan) {
    conn.reply(
      m.chat,
      `Successfully ended your relationship with @${
        user.pasangan.split("@")[0]
      }`,
      m,
      {
        contextInfo: { mentionedJid: [user.pasangan] },
      }
    );
    user.pasangan = "";
    partner.pasangan = "";
  } else {
    conn.reply(m.chat, `You don't have a partner linked. 🤔`, m);
  }
};

handler.help = ["breakup"];
handler.tags = ["fun"];
handler.command = /^breakup$/i;
handler.group = true;
handler.limit = true;
handler.fail = null;

module.exports = handler;
