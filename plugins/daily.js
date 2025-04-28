let free = 500;
const prem = 200000;
let levelling = require("../lib/levelling");
let fs = require("fs");
let data = JSON.parse(fs.readFileSync("src/code_redeem.json"));
let obj_ = data.group.trial;
let objhalf = data.group.half;
let obj = data.group.one;
let obj2 = data.group.two;

let handler = async (
  m,
  { conn, usedPrefix, isPrems, isMods, text, command }
) => {
  let users = global.db.data.users[m.sender];
  let { level, exp } = users;
  let levelpast = levelling.findLevel(exp);
  let xp = ((isPrems ? prem : free) * level) / 100 + free;
  let xpAfter = ((isPrems ? prem : free) * levelpast) / 100 + free;
  let time = users.lastclaim + (isPrems || isMods ? 86400000 : 43200000);
  let timecode = users.lastclaim_code + 86400000;
  let code = newCode("trial");

  while (data.used.includes(code)) {
    code = newCode();
  }

  let kode = /kode/i.test(text);

  if (
    new Date() - users.lastclaim < (isPrems || isMods ? 86400000 : 43200000) &&
    !kode
  ) {
    throw `You have already claimed your daily reward today.\nPlease wait ${conn.msToDate(
      time - new Date()
    )} before claiming again.`;
  }

  if (
    !users.autolevelup &&
    !/now/i.test(command) &&
    !kode &&
    levelling.canLevelUp(users.level, users.exp, global.multiplier)
  ) {
    return conn.reply(
      m.chat,
      `_You have enough XP to level up!_ *${level} ➔ ${levelpast}*\n\nLeveling up will give you more XP on daily claims.\nUse *${usedPrefix}levelup* to level up!\n\nCurrent claim reward: ${xp}\nReward after leveling up: ${xpAfter}\nOr claim now (type ${usedPrefix}claimnow)`,
      m
    );
  }

  if (isPrems) users.limit += 10;

  if (text && kode) {
    if (m.isGroup) throw `_You can only claim redeem codes in private chat._`;
    if (new Date() - users.lastclaim_code < 86400000 * 2) {
      throw `_You have already claimed a free group redeem code._\nPlease wait ${conn.msToDate(
        timecode - new Date()
      )} before claiming again.\n\nYou can claim a free group code every 2 days.`;
    }

    await m.reply(
      `*Type:* ${text}\n\n_How to use:_\nCopy the code below\nPaste it into the group where you want to activate the bot.\n\n*Note: Make sure the bot has been added to your group.*\n\nIf you want a redeem code with longer active time, type _*.premium*_ or contact .owner`
    );
    await m.reply(`${usedPrefix}use ${code}`);

    users.lastclaim_code = new Date() * 1 + 86400000;
  } else {
    users.exp += xp;
    m.reply(`+${xp} XP ${isPrems ? "\n+10 Limit" : ""}`);
    users.lastclaim = new Date() * 1;
  }
};

handler.help = ["claim", "daily"];
handler.tags = ["xp"];
handler.command = /^(daily|claim)(now)?$/i;

module.exports = handler;

function newCode(text) {
  let code;
  switch (text) {
    case "trial":
      code = obj_[Math.floor(Math.random() * 1000)];
      break;
    case "half":
      code = objhalf[Math.floor(Math.random() * 1000)];
      break;
    case "one":
      code = obj[Math.floor(Math.random() * 1000)];
      break;
    case "two":
      code = obj2[Math.floor(Math.random() * 1000)];
      break;
    default:
      code = false;
  }
  return code;
}
