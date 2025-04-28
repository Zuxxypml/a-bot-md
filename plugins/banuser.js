let acc = {};

let handler = (m, { conn, text, args, isROwner, usedPrefix }) => {
  let [who, time, reason] = text.split("|");
  if (!isROwner) {
    if (!(time && who && reason))
      throw `Please input target, duration, and reason!\n\nExample:\n${usedPrefix}ban tag/reply/number|days|reason`;
  }

  if (m.isGroup) {
    who = m.mentionedJid[0]
      ? m.mentionedJid[0]
      : m.quoted
      ? m.quoted.sender
      : who
      ? who.replace(/[^0-9]/g, "") + "@s.whatsapp.net"
      : false;
  } else {
    who = who ? who.replace(/[^0-9]/g, "") + "@s.whatsapp.net" : m.chat;
  }

  if (!who)
    throw "Tag, reply, or input the number of the user you want to ban.";

  let users = global.db.data.users;
  if (!(who in users)) users[who] = { banned: false };

  if (!isROwner) {
    acc[who] = {
      from: m.sender.split`@`[0],
      who: who.split`@`[0],
      reason,
      time,
    };
    conn.reply(
      global.owner[0] + "@s.whatsapp.net",
      `*BAN REQUEST*\n(Requested by: ${
        db.data.users[m.sender].name
      })\n${Object.entries(acc[who])
        .map((v) => `*${v[0][0].toUpperCase() + v[0].substring(1)}:* ${v[1]}`)
        .join("\n")}`
    );
    m.reply(
      `_Your ban request has been sent to the main Owner._\nPlease wait for their approval.`
    );
    return !0;
  }

  users[who].banned = true;
  users[who].bannedreason = reason;
  users[who].bannedtime = new Date() * 1 + 86400000 * (time || 1); // default 1 day if time missing
  m.reply(
    `✅ *The user has been successfully banned!*\nThe bot will not respond to this number for ${conn.msToDate(
      users[who].bannedtime - new Date() * 1
    )}.\n\nContact the Owner to request an unban.`
  );
};

handler.help = ["ban @user|days|reason"];
handler.tags = ["owner"];
handler.command = /^ban$/i;
handler.owner = true;

module.exports = handler;
