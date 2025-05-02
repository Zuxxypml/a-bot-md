let handler = async (m, { conn, text }) => {
  let who;

  if (m.isGroup) {
    who =
      m.mentionedJid?.[0] ||
      (m.quoted ? m.quoted.sender : false) ||
      (text ? text.replace(/[^0-9]/g, "") + "@s.whatsapp.net" : false);
  } else {
    who = text ? text.replace(/[^0-9]/g, "") + "@s.whatsapp.net" : m.chat;
  }

  if (!who) throw "⚠️ Please tag, reply to a user, or provide a valid number.";

  let users = global.db.data.users;
  if (!users[who]) users[who] = {};

  if (!users[who].banned) {
    throw `_The number is not banned._`;
  }

  users[who].banned = false;
  conn.reply(
    m.chat,
    `✅ *User has been unbanned.*\nBot will now respond to ${
      who.split("@")[0]
    }.`,
    m
  );
};

handler.help = ["unban @user / number"];
handler.tags = ["owner"];
handler.command = /^unban$/i;
handler.owner = true;

module.exports = handler;
