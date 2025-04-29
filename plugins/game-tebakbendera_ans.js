const similarity = require("similarity");
const threshold = 0.72; // 72% similarity threshold

let handler = (m) => m;

handler.before = async function (m) {
  let id = m.chat;

  // Ignore if not replying to bot message about tebakbendera
  if (
    !m.quoted ||
    !m.quoted.fromMe ||
    !m.quoted.isBaileys ||
    !/Type.*tbhint/i.test(m.quoted.text)
  )
    return !0;

  this.tebakbendera = this.tebakbendera ? this.tebakbendera : {};
  if (!(id in this.tebakbendera)) {
    return m.reply("That question has already ended.");
  }

  if (m.quoted.id === this.tebakbendera[id][0].id) {
    let json = JSON.parse(JSON.stringify(this.tebakbendera[id][1]));

    if (m.text.toLowerCase().trim() === json.name.toLowerCase().trim()) {
      // Correct Answer
      global.db.data.users[m.sender].exp += this.tebakbendera[id][2];
      global.db.data.users[m.sender].limit += 1;

      await conn.sendFile(m.chat, "./src/media/image/true.webp", m, {
        packname: packname,
        author: author,
      });

      setTimeout(() => {
        conn.reply(m.chat, `*+1,000 XP*\n*+1 Limit*`, m);
      }, 3000);

      clearTimeout(this.tebakbendera[id][3]);
      delete this.tebakbendera[id];
    } else if (
      similarity(m.text.toLowerCase(), json.name.toLowerCase().trim()) >=
      threshold
    ) {
      m.reply("*Almost there! Keep trying!*");
    } else {
      // Wrong Answer
      await conn.sendFile(m.chat, "./src/media/image/false.webp", m, {
        packname: packname,
        author: author,
      });
      // No additional reply needed (already sending "wrong" sticker)
    }
  }

  return !0;
};

handler.exp = 0;

module.exports = handler;
