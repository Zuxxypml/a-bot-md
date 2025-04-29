const limitPerXp = 300;
let pendingConfirmations = {};

let handler = async (m, { conn, command, args, usedPrefix }) => {
  // If a confirmation is already pending for this user
  if (m.sender in pendingConfirmations) {
    conn.reply(m.chat, "❗ Please confirm your previous exchange first.", m);
    throw false;
  }

  // Determine how many limits to sell
  let count = command.replace(/^sell/i, "");
  if (/all/i.test(count)) {
    count = Math.floor(global.db.data.users[m.sender].limit);
  } else if (count) {
    count = parseInt(count);
  } else if (args[0]) {
    count = parseInt(args[0]);
  } else {
    count = 1;
  }
  count = Math.max(1, count);

  const userData = global.db.data.users[m.sender];
  if (userData.limit >= count) {
    // Ask for confirmation
    const xpGain = count * limitPerXp;
    const prompt =
      `You’re about to sell *${count}* limit(s)\n` +
      `You will receive *+${xpGain}* XP\n\n` +
      `Do you want to proceed? (Yes/Y or No/N)\n` +
      `(Expires in 60 seconds)`;

    const replyMsg = await m.reply(prompt);
    pendingConfirmations[m.sender] = {
      replyMsg,
      limitPerXp,
      count,
      timeout: setTimeout(() => {
        m.reply("⌛ Confirmation time expired.");
        delete pendingConfirmations[m.sender];
      }, 60000),
    };
    throw false;
  } else {
    // Not enough limit
    conn.reply(
      m.chat,
      `❗ You don’t have enough limit to sell.\n` +
        `1 Limit = ${limitPerXp} XP\n` +
        `Please check your limit and try again.`,
      m
    );
  }
};

// Handle confirmation answers
handler.all = async function (m) {
  if (!(m.sender in pendingConfirmations)) return;

  let { limitPerXp, count, timeout } = pendingConfirmations[m.sender];
  const text = m.text.trim().toLowerCase();

  if (/^(yes|y)$/i.test(text)) {
    // Execute the exchange
    global.db.data.users[m.sender].exp += limitPerXp * count;
    global.db.data.users[m.sender].limit -= count;

    this.reply(
      m.chat,
      `✅ Exchange successful!\n` +
        `+${limitPerXp * count} XP\n` +
        `-${count} Limit\n\n` +
        `Tip: You can sell multiple at once, e.g.:\n` +
        `${usedPrefix}sell 5`,
      m
    );
    clearTimeout(timeout);
    delete pendingConfirmations[m.sender];
    return true;
  } else if (/^(no|n)$/i.test(text)) {
    // Cancel the exchange
    this.reply(m.chat, "❌ Exchange cancelled.", m);
    clearTimeout(timeout);
    delete pendingConfirmations[m.sender];
    return true;
  }

  // If neither yes nor no, ignore
};

handler.help = ["sell [amount]", "sellall"];
handler.tags = ["xp"];
handler.command = /^sell([0-9]+)?|sellall$/i;

module.exports = handler;
