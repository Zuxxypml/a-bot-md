const similarity = require("similarity");
const threshold = 0.72;

let handler = (m) => m;

handler.before = async function (m) {
  let id = m.chat;
  if (
    !m.quoted ||
    !m.quoted.fromMe ||
    !m.quoted.isBaileys ||
    !/TEBAK CAK LONTONG/i.test(m.quoted.footerText || "")
  )
    return !0;

  this.caklontong = this.caklontong || {};
  if (!(id in this.caklontong))
    return m.reply("⚠️ This question has already ended.");

  if (m.quoted.id === this.caklontong[id][0].id) {
    let json = JSON.parse(JSON.stringify(this.caklontong[id][1]));

    if (/(.apa|bantuan|^$)/i.test(m.text)) return !0;

    if (m.text.toLowerCase() === json.result.answer.toLowerCase()) {
      global.db.data.users[m.sender].exp += this.caklontong[id][2];
      m.reply(
        `✅ *Correct!*\n\n📖 Reason: ${json.result.information}\n➕ +${this.caklontong[id][2]} XP`
      );
      clearTimeout(this.caklontong[id][3]);
      delete this.caklontong[id];
    } else if (
      similarity(
        m.text.toLowerCase(),
        json.result.answer.toLowerCase().trim()
      ) >= threshold
    ) {
      m.reply(`✨ *Almost there! Keep trying!*`);
    } else {
      m.reply(`❌ *Wrong answer, hehe...*`);
    }
  }
  return !0;
};

handler.exp = 0;

module.exports = handler;
