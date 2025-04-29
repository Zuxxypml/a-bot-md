const similarity = require("similarity");
const threshold = 0.72; // The higher the value, the stricter the similarity check

module.exports = {
  async before(m) {
    this.game = this.game ? this.game : {};
    let id = "family100_" + m.chat;
    if (!(id in this.game)) return true;
    let room = this.game[id];

    if (room.answers == undefined) {
      delete this.game[id];
      return true;
    }

    let text = m.text.toLowerCase().replace(/[^\w\s\-]+/, "");
    let isSurrender = /^((i )?give up|surr?ender)$/i.test(m.text);

    if (!isSurrender) {
      let index = room.answers.indexOf(text);
      if (index < 0) {
        if (
          Math.max(
            ...room.answers
              .filter((_, idx) => !room.answered[idx])
              .map((answer) => similarity(answer, text))
          ) >= threshold
        ) {
          m.reply("Almost correct!");
        }
        return true;
      }
      if (room.answered[index]) return true;

      let users = global.db.data.users[m.sender];
      room.answered[index] = m.sender;
      users.exp += room.winScore;
    }

    let isWin = room.answered.length === room.answered.filter((v) => v).length;
    let caption = `
*Question:* ${room.question}

There are *${room.answers.length}* answers${
      room.answers.find((v) => v.includes(" "))
        ? `
(Some answers contain spaces)
`
        : ""
    }
${isWin ? `*ALL ANSWERS GUESSED!*` : isSurrender ? "*GAVE UP!*" : ""}
${Array.from(room.answers, (answer, index) => {
  return isSurrender || room.answered[index]
    ? `(${index + 1}) ${answer} ${
        room.answered[index] ? "@" + room.answered[index].split("@")[0] : ""
      }`.trim()
    : false;
})
  .filter((v) => v)
  .join("\n")}

${isSurrender ? "" : `+${room.winScore} XP for each correct answer`}
`.trim();

    if (this.game[id].msg_old) {
      await conn
        .sendMessage(m.chat, { delete: this.game[id].msg_old.key })
        .catch((e) => e);
    }

    let msg_old = await this.reply(m.chat, caption, m)
      .then((msg) => {
        return (this.game[id].msg = msg);
      })
      .catch((_) => _);

    this.game[id].msg_old = msg_old;

    if (isWin || isSurrender) {
      setTimeout(() => {
        conn
          .sendMessage(m.chat, { delete: this.game[id].msg.key })
          .catch((e) => e);
        delete this.game[id];
      }, 10000);
    }

    return true;
  },
};
