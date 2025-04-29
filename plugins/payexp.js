let taxRate = 0.02;

let handler = async (m, { conn, text, usedPrefix, command }) => {
  let failMessage = `_This feature lets you share your XP with another user._\n\nExample:\n${
    usedPrefix + command
  } @6287857180075 10\nor reply to a user's message and type: ${
    usedPrefix + command
  } 10`;

  let users = global.db.data.users;
  let recipient;

  // Get the recipient user based on group context
  if (m.isGroup) {
    recipient = m.mentionedJid[0]
      ? m.mentionedJid[0]
      : m.quoted
      ? m.quoted.sender
      : false;
  } else {
    recipient = m.chat;
  }

  if (!recipient) return conn.reply(m.chat, failMessage, m);

  if (!(recipient in users)) {
    users[recipient] = { exp: 0 };
  }

  let amountText = text.replace("@" + recipient.split("@")[0], "").trim();
  if (!amountText) return conn.reply(m.chat, failMessage, m);
  if (isNaN(amountText)) throw "Only numbers are allowed.";

  let xp = parseInt(amountText);
  let tax = Math.ceil(xp * taxRate);
  let totalCost = xp + tax;

  if (totalCost < 1) throw "Minimum transfer is 1 XP.";
  if (totalCost > users[m.sender].exp)
    throw "_You don’t have enough XP to transfer._";

  // Process the transfer
  users[m.sender].exp -= totalCost;
  users[owner[0] + "@s.whatsapp.net"].exp += tax;
  users[recipient].exp += xp;

  // Notify sender and recipient
  m.reply(
    `You transferred ${xp} XP (+${tax} XP tax) = *${totalCost} XP total*.`
  );
  conn.fakeReply(m.chat, `You received +${xp} XP 🎉`, recipient, m.text);
};

handler.help = ["payexp @user <amount>"];
handler.tags = ["xp"];
handler.command = /^payexp$/i;

module.exports = handler;
