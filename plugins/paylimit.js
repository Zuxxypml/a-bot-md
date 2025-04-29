let handler = async (m, { conn, text, usedPrefix, command }) => {
  let failMessage = `_This feature allows you to share your *Limit* with another user._\n\nExample:\n${
    usedPrefix + command
  } @6287857180075 10\nor reply to someone's message with: ${
    usedPrefix + command
  } 10`;

  let users = global.db.data.users;
  let recipient;

  // Determine recipient in group or private chat
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

  // Ensure the recipient exists in database
  if (!(recipient in users)) {
    users[recipient] = { limit: 10 }; // default limit if not present
  }

  let amountText = text.replace("@" + recipient.split("@")[0], "").trim();
  if (!amountText) return conn.reply(m.chat, failMessage, m);
  if (isNaN(amountText)) throw "Only numbers are allowed.";

  let limitAmount = parseInt(amountText);
  if (limitAmount < 1) throw "Minimum transfer is 1 limit.";
  if (limitAmount > users[m.sender].limit)
    throw "_You do not have enough limit to transfer._";

  // Process transfer
  users[m.sender].limit -= limitAmount;
  users[recipient].limit += limitAmount;

  m.reply(`(-${limitAmount} Limit) sent`);
  conn.fakeReply(
    m.chat,
    `+${limitAmount} Limit received 🎁`,
    recipient,
    m.text
  );
};

handler.help = ["paylimit @user [amount]"];
handler.tags = ["xp"];
handler.command = /^(tf|pay)limit$/i;

module.exports = handler;
