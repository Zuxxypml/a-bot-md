let levelling = require("../lib/levelling");
let handler = async (m, { conn, usedPrefix }) => {
  let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender;
  let { name, limit, exp, pasangan, level, role, suit, skata } =
    global.db.data.users[who];
  let jodoh = `Dating @${pasangan.split`@`[0]}`;
  let { min, xp, max } = levelling.xpRange(level, global.multiplier);
  let math = max - exp;
  conn.reply(
    m.chat,
    `
*Name*: ${name}
*XP*: ${exp} (${exp - min}/ ${xp})
[${
      math <= 0
        ? `Ready to ${usedPrefix}levelup`
        : `Need ${math} more XP to level up`
    }]
*Level*: ${level}
*Role*: ${role}
*Status*: ${pasangan ? jodoh : "Single"}
*Limit*: ${limit}
*Total MMR*: ${suit + (skata ? skata : 1)} \n${conn.readmore}
Exchange rate: 1 limit = 350 XP

How to exchange: type
${usedPrefix}buy

You can earn XP by playing Bot games in *${usedPrefix}menu game*
`.trim(),
    m
  );
};

handler.help = ["cek"];
handler.tags = ["xp"];
handler.command = /^(cek|limit|me)$/i;
handler.register = true;

module.exports = handler;
