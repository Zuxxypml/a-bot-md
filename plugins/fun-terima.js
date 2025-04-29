let handler = async (m, { conn, text }) => {
  let number;
  if (isNaN(text)) {
    number = text.split`@`[1];
  } else if (!isNaN(text)) {
    number = text;
  }

  const formatNumber = (num) => {
    const n = String(num);
    const p = n.indexOf(".");
    return n.replace(/\d(?=(?:\d{3})+(?:\.|$))/g, (m, i) =>
      p < 0 || i < p ? `${m},` : m
    );
  };

  if (!text && !m.quoted) {
    return conn.reply(
      m.chat,
      `*Please tag, mention, or reply to the proposal target.*`,
      m
    );
  }

  if (isNaN(number)) return conn.reply(m.chat, `*Invalid number format.*`, m);
  if (number.length > 15)
    return conn.reply(m.chat, `*Invalid number length.*`, m);

  try {
    if (text) {
      var user = number + "@s.whatsapp.net";
    } else if (m.quoted.sender) {
      var user = m.quoted.sender;
    } else if (m.mentionedJid) {
      var user = number + "@s.whatsapp.net";
    }
  } catch (e) {
    console.error(e);
  } finally {
    let groupMetadata = m.isGroup ? await conn.groupMetadata(m.chat) : {};
    let participants = m.isGroup ? groupMetadata.participants : [];
    let users = m.isGroup ? participants.find((u) => u.jid == user) : {};

    if (!user) {
      return conn.reply(
        m.chat,
        `*Target not found, maybe they left the group or are not a participant.*`,
        m
      );
    }
    if (user === m.sender) {
      return conn.reply(m.chat, `*You can't accept yourself. 😂*`, m);
    }
    if (user === conn.user.jid) {
      return conn.reply(m.chat, `*You can't accept the bot proposal. 🤖*`, m);
    }

    if (global.db.data.users[user].pasangan !== m.sender) {
      conn.reply(
        m.chat,
        `*Sorry, @${user.split("@")[0]} did not propose to you.*`,
        m,
        {
          contextInfo: { mentionedJid: [user] },
        }
      );
    } else {
      global.db.data.users[m.sender].pasangan = user;
      conn.reply(
        m.chat,
        `*Congratulations! 🎉 You are now officially dating @${
          user.split("@")[0]
        }*\n\n*Wishing you love and happiness forever @${
          user.split("@")[0]
        } ♡ @${m.sender.split("@")[0]} 🥳💖*`,
        m,
        {
          contextInfo: { mentionedJid: [m.sender, user] },
        }
      );
    }
  }
};

handler.help = ["accept *@user*"];
handler.tags = ["fun"];
handler.command = /^(accept)$/i;
handler.group = true;
handler.limit = false;
handler.fail = null;

module.exports = handler;
