const fs = require("fs");
const winScore = 500;

async function handler(m) {
  this.game = this.game ? this.game : {};
  let id = "family100_" + m.chat;

  if (id in this.game) {
    if (this.game[id].id !== undefined) {
      return this.reply(
        m.chat,
        "There is still an ongoing quiz in this chat!\nType *Give up* to end it.",
        this.game[id].msg
      );
    }
    delete this.game[id];
    throw false;
  }

  this.game[id] = {};
  let src = JSON.parse(fs.readFileSync(`./src/scrap/family.json`));
  let json = src[Math.floor(Math.random() * src.length)];

  let caption = `
*Question:* ${json.soal}

There are *${json.jawaban.length}* answers${
    json.jawaban.find((v) => v.includes(" "))
      ? `
(Some answers contain spaces)
`
      : ""
  }

+${winScore} XP for each correct answer
    `.trim();

  this.game[id] = {
    id,
    msg: await m.reply(caption),
    ...json,
    terjawab: Array.from(json.jawaban, () => false),
    winScore,
  };
}

handler.help = ["family100"];
handler.tags = ["game"];
handler.group = true;
handler.command = /^family100$/i;

module.exports = handler;
