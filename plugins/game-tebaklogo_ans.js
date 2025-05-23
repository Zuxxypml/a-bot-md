const similarity = require("similarity");
const threshold = 0.72;

let handler = (m) => m;

handler.before = async function (m) {
  let id = m.chat;

  if (
    !m.quoted ||
    !m.quoted.fromMe ||
    !m.quoted.isBaileys ||
    !m.text ||
    !/Type.*hlog/i.test(m.quoted.text) ||
    /.*hlog/i.test(m.text)
  )
    return !0;

  this.tebaklogo = this.tebaklogo ? this.tebaklogo : {};

  if (!(id in this.tebaklogo))
    return conn.reply(m.chat, "⚠️ That question has already ended.", m);

  if (m.quoted.id === this.tebaklogo[id][0].id) {
    let isSurrender = /^((me)?nyerah|surr?ender)$/i.test(m.text);
    if (isSurrender) {
      clearTimeout(this.tebaklogo[id][3]);
      delete this.tebaklogo[id];
      return conn.reply(m.chat, "*You surrendered! 😔*", m);
    }

    let json = JSON.parse(JSON.stringify(this.tebaklogo[id][1]));

    if (m.text.toLowerCase() === json.jawaban.toLowerCase().trim()) {
      global.db.data.users[m.sender].exp += this.tebaklogo[id][2];
      global.db.data.users[m.sender].limit += 1;
      global.db.data.users[m.sender].exp += 600; // Extra XP bonus

      // Correct Answer
      await conn.sendFile(m.chat, "./src/media/image/true.webp", m, {
        packname: packname,
        author: author,
      });

      setTimeout(() => {
        conn.reply(m.chat, `*+600 XP*`, m);
      }, 3000);

      clearTimeout(this.tebaklogo[id][3]);
      delete this.tebaklogo[id];
    } else if (
      similarity(m.text.toLowerCase(), json.jawaban.toLowerCase().trim()) >=
      threshold
    ) {
      m.reply("❗ *Almost there!*");
    } else {
      // Wrong Answer
      await conn.sendFile(m.chat, "./src/media/image/false.webp", m, {
        packname: packname,
        author: author,
      });
    }
  }

  return !0;
};

handler.exp = 0;

module.exports = handler;
