let fs = require("fs");

let handler = async (m, { conn, text }) => {
  let json = JSON.parse(fs.readFileSync("./src/premium.json"));
  let who;

  delete require.cache[require.resolve("../config")];
  require("../config");

  if (m.isGroup) {
    who = m.mentionedJid[0]
      ? m.mentionedJid[0]
      : m.quoted
      ? m.quoted.sender
      : text.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
  } else {
    who = text ? text.replace(/[^0-9]/g, "") + "@s.whatsapp.net" : m.chat;
  }

  if (!json.includes(who))
    throw `${await conn.getName(who, {
      withoutContact: true,
    })} is not a premium user!`;

  let index = json.indexOf(who);
  json.splice(index, 1);

  fs.writeFileSync("./src/premium.json", JSON.stringify(json));

  if (db.data.users[who]) db.data.users[who].premdate = 0;

  m.reply(
    `${await conn.getName(who, {
      withoutContact: true,
    })} has been removed from premium users!`
  );

  delete require.cache[require.resolve("../config")];
  require("../config");
};

handler.help = ["delprem @user"];
handler.tags = ["owner"];
handler.command = /^(remove|hapus|-|del)prem$/i;
handler.rowner = true;

module.exports = handler;
