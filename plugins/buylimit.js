const xpperlimit = 350;
let confirmbuy = {};

let handler = async (m, { conn, command, args, usedPrefix }) => {
  if (m.sender in confirmbuy) {
    conn.reply(
      m.chat,
      "⚠️ You still have a pending confirmation. Please reply (Yes/No) first.",
      m
    );
    throw false;
  }

  let count = command.replace(/^buy/i, "");
  count = count
    ? /all/i.test(count)
      ? Math.floor(global.db.data.users[m.sender].exp / xpperlimit)
      : parseInt(count)
    : args[0]
    ? parseInt(args[0])
    : 1;
  count = Math.max(1, count);

  if (global.db.data.users[m.sender].exp >= xpperlimit * count) {
    confirmbuy[m.sender] = {
      msg: m.reply(
        `💬 *Confirm Purchase*\nYou are about to exchange *${
          xpperlimit * count
        } XP* for *${count} Limit*\n\n➔ Reply *Yes* to confirm, or *No* to cancel.\n\n⏳ *You have 60 seconds to reply.*`
      ),
      xpperlimit,
      count,
      timeout: setTimeout(() => {
        m.reply("⌛ Confirmation expired.");
        delete confirmbuy[m.sender];
      }, 60000),
    };
    throw false;
  } else {
    await conn.reply(
      m.chat,
      `⚠️ Not enough XP.\n\nTo buy *${count}* limit you need *${
        xpperlimit * count
      } XP*.\nYour XP: *${global.db.data.users[m.sender].exp}*`,
      m
    );
  }
};

handler.all = async function (m) {
  if (!(m.sender in confirmbuy)) return;
  let { xpperlimit, count, timeout } = confirmbuy[m.sender];

  if (/^(y(es|a)?)$/i.test(m.text)) {
    global.db.data.users[m.sender].exp -= xpperlimit * count;
    global.db.data.users[m.sender].limit += count;
    this.reply(
      m.chat,
      `✅ Successfully exchanged:\n- *${
        xpperlimit * count
      } XP*\n+ *${count} Limit*\n\nYou can buy multiple at once too!\nExample:\n${usedPrefix}buy 5`,
      m
    );
    clearTimeout(timeout);
    delete confirmbuy[m.sender];
    return true;
  } else if (/^(no?|tidak|g(ak)?)$/i.test(m.text)) {
    delete confirmbuy[m.sender];
    m.reply("❌ Purchase canceled.");
    clearTimeout(timeout);
    return true;
  }
};

handler.help = ["buy", "buy [amount]", "buyall"];
handler.tags = ["xp"];
handler.command = /^buy([0-9]+)?$|^buyall$/i;

module.exports = handler;
