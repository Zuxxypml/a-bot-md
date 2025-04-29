let fs = require("fs");
let json = JSON.parse(fs.readFileSync("./src/group.json"));

let handler = async (
  m,
  { conn, args, usedPrefix, isOwner, participants, isPrems, command }
) => {
  if (conn.user.jid !== global.conn.user.jid) {
    if (participants.map((v) => v.id).includes(global.conn.user.jid))
      throw `Cannot proceed, master bot is present in this group.`;
  }

  let chat = global.db.data.chats[m.chat];
  let dataJson = {};
  let duration;
  let add = /ext/i.test(command) && isOwner;

  if (chat.init && !add) throw `This group has already been initialized.`;
  if (args[0] && args[0] !== "permanent" && isNaN(args[0]))
    throw `Only numbers are allowed.`;

  if (isOwner) duration = args[0] ? args[0] : 30; // default 30 days for owner
  else if (isPrems)
    duration = Math.floor(
      (db.data.users[m.sender].premdate - Date.now()) / 86400000
    );
  else duration = 0.5; // 12 hours (0.5 day) for normal users (trial)

  if (/permanent/i.test(args[0])) {
    if (!isOwner) throw `Only the owner can set permanent groups.`;
    conn.reply(
      m.chat,
      `Successfully set *${conn.getName(
        m.chat
      )}* as permanent.\n\nType ${usedPrefix}statusgc to check.`,
      m
    );
    chat.permanent = true;
    chat.gcdate = 0;
    dataJson.permanent = true;
    dataJson.expired = 0;
  } else if (add) {
    if (!args[0]) throw `Please provide the number of days.`;
    if (chat.gcdate == 0) chat.gcdate = Date.now() + 86400000 * 30;
    chat.permanent = false;
    conn.reply(
      m.chat,
      `Successfully extended active time for *${conn.getName(m.chat)}* by ${
        args[0]
      } day(s).\n\nType ${usedPrefix}statusgc to check.`,
      m
    );
    chat.gcdate += args[0] * 86400000;
  } else {
    if (!(isOwner || isPrems)) {
      if (chat.trial)
        return conn.reply(
          m.chat,
          `This group has already used its free trial.\n\nPlease contact the owner to rent the bot.`,
          m
        );
      chat.trial = 1;
    }
    chat.gcdate = Date.now() + 86400000 * duration;
    dataJson.expired = Date.now() + 86400000 * duration;
    conn.reply(
      m.chat,
      `Initialization successful.\nBot will leave *${conn.getName(
        m.chat
      )}* in ${duration} day(s).\n\nType ${usedPrefix}statusgc to check.`,
      m
    );
  }

  dataJson.name = `${conn.getName(m.chat)} (${m.chat})`;
  dataJson.owner_group = m.chat.split`- `[0];
  dataJson.joiner = m.sender;
  chat.init = true;
  json.push(dataJson);
  fs.writeFileSync("./src/group.json", JSON.stringify(json));
};

handler.help = ["init <days>"];
handler.tags = ["owner"];
handler.command = /^(init|ext(end)?)$/i;
handler.group = true;
handler.premium = true;

handler.disabled = 1;

module.exports = handler;
