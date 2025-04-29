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
    !/Type.*hhew/i.test(m.quoted.text) ||
    /.*hhew/i.test(m.text)
  )
    return !0;

  this.tebakhewan = this.tebakhewan ? this.tebakhewan : {};

  if (!(id in this.tebakhewan))
    return this.reply(m.chat, "⚠️ That question has already ended.", m);

  if (m.quoted.id === this.tebakhewan[id][0].id) {
    let isSurrender = /^((me)?nyerah|surr?ender)$/i.test(m.text);
    if (isSurrender) {
      clearTimeout(this.tebakhewan[id][3]);
      delete this.tebakhewan[id];
      return this.reply(m.chat, "*You surrendered! 😔*", m);
    }

    let json = JSON.parse(JSON.stringify(this.tebakhewan[id][1]));

    if (m.text.toLowerCase() === json.title.toLowerCase().trim()) {
      global.db.data.users[m.sender].exp += this.tebakhewan[id][2];
      global.db.data.users[m.sender].exp += 1000; // Bonus XP

      // Correct Answer
      await conn.sendFile(m.chat, "./src/media/image/true.webp", m, {
        packname: packname,
        author: author,
      });

      setTimeout(() => {
        conn.reply(m.chat, `*+1,000 XP*`, m);
      }, 3000);

      clearTimeout(this.tebakhewan[id][3]);
      delete this.tebakhewan[id];
    } else if (
      similarity(m.text.toLowerCase(), json.title.toLowerCase().trim()) >=
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

// Bonus button if you ever use inline buttons (not really needed here yet)
const buttontebakhewan = [["Guess the Animal", "/guessanimal"]];
