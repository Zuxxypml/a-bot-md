const handler = async (m, { conn, text, usedPrefix }) => {
  if (!text) throw `Please tag someone or provide a number!`;

  let number;
  if (isNaN(text)) {
    number = text.split`@`[1];
  } else {
    number = text;
  }

  const formatNumber = (num) => {
    const n = String(num);
    const p = n.indexOf(".");
    return n.replace(/\d(?=(?:\d{3})+(?:\.|$))/g, (m, i) =>
      p < 0 || i < p ? `${m},` : m
    );
  };

  if (isNaN(number)) throw `Invalid number format!`;
  if (number.length > 15) throw `Invalid number length!`;

  let user;
  try {
    if (text) {
      user = number + "@s.whatsapp.net";
    } else if (m.quoted.sender) {
      user = m.quoted.sender;
    } else if (m.mentionedJid) {
      user = number + "@s.whatsapp.net";
    }
  } catch (e) {
    console.error(e);
  }

  if (!user) {
    return conn.reply(
      m.chat,
      `Target not found. Maybe they left the group or are not a participant.`,
      m
    );
  }

  if (user === m.sender) {
    return conn.reply(m.chat, `You can't propose to yourself. 😂`, m);
  }

  if (typeof global.db.data.users[user] == "undefined") {
    return m.reply(`Target user is not registered in the database.`);
  }

  const senderData = global.db.data.users[m.sender];
  const targetData = global.db.data.users[user];

  if (
    senderData.pasangan !== "" &&
    global.db.data.users[senderData.pasangan]?.pasangan === m.sender &&
    senderData.pasangan !== user
  ) {
    const fine = Math.ceil((senderData.exp / 1000) * 20);
    senderData.exp -= fine;
    return conn.reply(
      m.chat,
      `You are already in a relationship with @${
        senderData.pasangan.split("@")[0]
      }!\n\nBreak up first using ${usedPrefix}breakup @user to propose to @${
        user.split("@")[0]
      }.\n\nStay loyal!\nFine: ${formatNumber(fine)} XP (20%)`,
      m,
      {
        contextInfo: {
          mentionedJid: [user, senderData.pasangan],
        },
      }
    );
  } else if (targetData.pasangan !== "") {
    const targetPartner = targetData.pasangan;
    if (global.db.data.users[targetPartner]?.pasangan === user) {
      const fine = Math.ceil((senderData.exp / 1000) * 20);
      senderData.exp -= fine;
      if (m.sender === targetPartner && senderData.pasangan === user) {
        return conn.reply(
          m.chat,
          `You are already in a relationship with @${
            user.split("@")[0]
          }!\n\nStay loyal!\nFine: ${formatNumber(fine)} XP (20%)`,
          m,
          {
            contextInfo: {
              mentionedJid: [user],
            },
          }
        );
      }
      return conn.reply(
        m.chat,
        `Have some respect.\n@${
          user.split("@")[0]
        } is already in a relationship with @${
          targetPartner.split("@")[0]
        }!\n\nFind someone else!\nFine: ${formatNumber(fine)} XP (20%)`,
        m,
        {
          contextInfo: {
            mentionedJid: [user, targetPartner],
          },
        }
      );
    } else {
      senderData.pasangan = user;
      return conn.reply(
        m.chat,
        `You have just proposed to @${
          user.split("@")[0]
        }.\n\nPlease wait for their response.\nType ${usedPrefix}accept @user or ${usedPrefix}reject @user.`,
        m,
        {
          contextInfo: {
            mentionedJid: [user],
          },
        }
      );
    }
  } else if (targetData.pasangan === m.sender) {
    senderData.pasangan = user;
    return conn.reply(
      m.chat,
      `Congratulations! 🎉 You are now officially in a relationship with @${
        user.split("@")[0]
      }.\n\nWish you happiness together! 💖`,
      m,
      {
        contextInfo: {
          mentionedJid: [user],
        },
      }
    );
  } else {
    senderData.pasangan = user;
    return conn.reply(
      m.chat,
      `You have just proposed to @${
        user.split("@")[0]
      }.\n\nPlease wait for their response.\nType ${usedPrefix}accept @user or ${usedPrefix}reject @user.`,
      m,
      {
        contextInfo: {
          mentionedJid: [user],
        },
      }
    );
  }
};

handler.help = ["propose @user"];
handler.tags = ["fun"];
handler.command = /^propose$/i;
handler.group = true;
handler.limit = false;
handler.fail = null;

module.exports = handler;
