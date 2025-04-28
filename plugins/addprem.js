const fs = require("fs");

let handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    let json = JSON.parse(fs.readFileSync("./src/premium.json"));
    let who;
    delete require.cache[require.resolve("../config")];
    require("../config");

    let [num, days] = text.split("|");
    if (!num || isNaN(days))
      throw `Enter a number to represent the number of days!\n\nExample:\n*${
        usedPrefix + command
      } ${owner[0]} | 30*`;

    if (m.isGroup) {
      who = (
        m.mentionedJid
          ? m.mentionedJid[0]
          : m.quoted
          ? m.quoted.sender
          : num.replace(/[^0-9]/g, "") + "@s.whatsapp.net"
      ).trim();
    } else {
      who = num ? num.replace(/[^0-9]/g, "") + "@s.whatsapp.net" : m.chat;
    }

    let duration = 86400000 * days.trim(); // 1 day = 86400000 ms

    if (json.includes(who.split`@`[0]))
      throw `${await conn.getName(who, {
        withoutContact: true,
      })} is already a premium member.`;

    json.push(`${who.split`@`[0]}`);
    fs.writeFileSync("./src/premium.json", JSON.stringify(json));

    m.reply(
      `✅ Successfully added ${await conn.getName(who, {
        withoutContact: true,
      })} as a Premium Member for ${days} day(s)!`
    );

    conn.sendButton(
      who,
      `Hello @${who.split`@`[0]}!

Welcome to _Premium Membership_!
`.trim(),
      `Enjoy exclusive Premium features:

- ${usedPrefix}join <group link> ➔ Add the bot into a group using a link.
- ${usedPrefix}jadibot ➔ Become a bot temporarily.

Check more features under the Premium Menu.`,
      1,
      [`Premium Menu`, `${usedPrefix}menu premium`],
      0,
      { contextInfo: { mentionedJid: [who] } }
    );

    global.db.data.users[who].premdate = new Date() * 1 + duration;
    delete require.cache[require.resolve("../config")];
    require("../config");
  } catch (e) {
    console.error(e);
    m.reply(`An error occurred while adding the premium member: ${e}`);
  }
};

handler.help = ["addprem [@user|days]"];
handler.tags = ["owner"];
handler.command = /^(add|tambah|\+)prem$/i;
handler.rowner = true;

module.exports = handler;
