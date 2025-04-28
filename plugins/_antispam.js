let handler = (m) => m;

handler.all = async function (m) {
  if (m.isBaileys) return; // Ignore bot's own system messages
  if (m.fromMe) return; // Ignore messages sent by the bot
  if (db.data.users[m.sender].banned) return; // Ignore if user is banned
  if (db.data.chats[m.chat].isBanned) return; // Ignore if chat is banned

  this.spam = this.spam ? this.spam : {};

  if (m.sender in this.spam) {
    this.spam[m.sender].count++;

    if (m.messageTimestamp.toNumber() - this.spam[m.sender].lastspam > 10) {
      if (this.spam[m.sender].count > 5) {
        m.reply(`Please @${m.sender.split("@")[0]}, do not spam.`, m.chat, {
          contextInfo: { mentionedJid: [m.sender] },
        });
      } else if (this.spam[m.sender].count > 10) {
        db.data.users[m.sender].banned = true;
        await this.reply(
          m.chat,
          `_*You have been banned!*_\nReason: Spamming\nContact the owner to request an unban.`,
          m
        );
      }
      this.spam[m.sender].count = 0;
      this.spam[m.sender].lastspam = m.messageTimestamp.toNumber();
    }
  } else {
    this.spam[m.sender] = {
      jid: m.sender,
      count: 0,
      lastspam: 0,
    };
  }
};

module.exports = handler;
