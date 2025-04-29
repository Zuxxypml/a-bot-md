const skata = require("../lib/sambung-kata");
const fs = require("fs");
const timeoutMs = 60000; // 60 seconds per turn
const bonusXp = 500;

let handler = (m) => m;

handler.before = async function (m) {
  this.skata = this.skata || {};
  const chatId = m.chat;
  if (!(chatId in this.skata)) return true;

  const room = this.skata[chatId];
  const users = global.db.data.users;
  const nextWord = await genKata();
  const players = room.player;
  let loseRating, winRating;

  function calcRating(type = "lose", jid = "") {
    const user = users[jid];
    let value;
    if (type === "win") {
      if (user.skata > 5000) value = rwd(5, 9);
      else if (user.skata > 3000) value = rwd(5, 10);
      else if (user.skata > 1500) value = rwd(10, 15);
      else if (user.skata > 1000) value = rwd(15, 20);
      else if (user.skata > 500) value = rwd(20, 30);
      else value = rwd(30, 50);
    } else {
      if (user.skata > 8000) value = rwd(35, 50);
      else if (user.skata > 5000) value = rwd(25, 30);
      else if (user.skata > 3000) value = rwd(20, 25);
      else if (user.skata > 1500) value = rwd(15, 19);
      else if (user.skata > 1000) value = rwd(10, 14);
      else if (user.skata > 500) value = rwd(5, 9);
      else value = rwd(1, 5);
    }
    return value;
  }

  // New round setup
  if (room.new) {
    if (!/nextkata/i.test(m.text)) return true;
    room.new = false;
    room.killer = null;
    room.kata = nextWord;
    room.chat = await this.reply(
      m.chat,
      `It's @${room.curr.split("@")[0]}'s turn\n` +
        `Start with: *${nextWord.toUpperCase()}*\n` +
        `Words must begin with: *${room
          .filter(nextWord)
          .toUpperCase()}... ?*\n` +
        `Reply to answer, or type "nyerah" to give up.\n` +
        `XP collected: ${room.win_point}\n` +
        `Remaining players:\n${
          this.readmore +
          players.map((jid, i) => `${i + 1}. ${users[jid].name}`).join("\n")
        }`,
      0
    );
  }

  // Time-up elimination
  if (room.diam) {
    if (!/nextkata/i.test(m.text)) return true;
    room.diam = false;
    room.waktu = setTimeout(() => {
      loseRating = calcRating("lose", room.curr);
      winRating = room.killer ? calcRating("win", room.killer) : null;
      this.reply(
        m.chat,
        `⏰ Time's up!\n` +
          `@${room.curr.split("@")[0]} eliminated -${loseRating} MMR` +
          (room.killer
            ? `\n@${room.killer.split("@")[0]} +${winRating} MMR`
            : ""),
        room.chat
      ).then(() => {
        room.eliminated.push(room.curr);
        if (room.killer) {
          users[room.killer].skata += winRating;
          users[room.curr].skata -= loseRating;
        }
        const idx = players.indexOf(room.curr);
        players.splice(idx, 1);
        room.curr = idx >= players.length ? players[0] : players[idx];

        if (players.length === 1 && room.status === "play") {
          this.reply(
            m.chat,
            `🏆 @${players[0].split("@")[0]} survived!\n+${room.win_point} XP`,
            room.chat
          ).then(() => {
            users[players[0]].exp += room.win_point;
            delete this.skata[chatId];
          });
        } else {
          room.diam = true;
          room.new = true;
          const nextUser = room.curr;
          conn.preSudo("nextkata", nextUser, m).then((_) => {
            this.ev.emit("messages.upsert", _);
          });
        }
      });
    }, timeoutMs);
  }

  // Current player's response
  if (room.curr === m.sender) {
    // Give up
    if (/nyerah/i.test(m.text)) {
      clearTimeout(room.waktu);
      loseRating = calcRating("lose", room.curr);
      winRating = room.killer ? calcRating("win", room.killer) : null;
      this.reply(
        m.chat,
        `😞 @${room.curr.split("@")[0]} gave up -${loseRating} MMR` +
          (room.killer
            ? `\n😀 @${room.killer.split("@")[0]} +${winRating} MMR`
            : ""),
        room.chat
      );
      room.eliminated.push(room.curr);
      if (room.killer) {
        users[room.killer].skata += winRating;
        users[room.curr].skata -= loseRating;
      }
      const idx = players.indexOf(room.curr);
      players.splice(idx, 1);
      room.curr = idx >= players.length ? players[0] : players[idx];

      if (players.length === 1 && room.status === "play") {
        await this.reply(
          m.chat,
          `🏆 @${players[0].split("@")[0]} survived!\n+${room.win_point} XP`,
          room.chat,
          { contextInfo: { mentionedJid: players } }
        );
        users[players[0]].exp += room.win_point;
        delete this.skata[chatId];
        return true;
      }

      room.new = true;
      room.diam = true;
      const nextUser = room.curr;
      const msg = await conn.preSudo("nextkata", nextUser, m);
      this.ev.emit("messages.upsert", msg);
    }

    // Answer handling
    if (
      !m.quoted ||
      !m.quoted.fromMe ||
      !m.quoted.isBaileys ||
      !/(Mulai|Tersisa) ?:/i.test(m.quoted.text)
    )
      return true;
    if (m.quoted.id === room.chat.id) {
      const answer = m.text
        .toLowerCase()
        .split(" ")[0]
        .replace(/[^a-z]/gi, "");
      const valid = await skata.cKata(answer);

      if (!answer.startsWith(room.filter(room.kata))) {
        return m.reply(
          `👎 Incorrect!\nYour word must start with *${room.filter(room.kata)}*`
        );
      } else if (!valid.status) {
        return m.reply(`👎 Invalid word: *${answer.toUpperCase()}*`);
      } else if (room.filter(room.kata) === answer) {
        return m.reply(`👎 Can't repeat the same word as the prompt!`);
      } else if (room.basi.includes(answer)) {
        return m.reply(`👎 Already used word: *${answer.toUpperCase()}*`);
      }

      clearTimeout(room.waktu);
      room.killer = m.sender;
      users[m.sender].exp += bonusXp;
      const idx = players.indexOf(room.curr);
      room.curr = idx + 1 >= players.length ? players[0] : players[idx + 1];
      room.basi.push(answer);
      room.win_point += 200;

      room.chat = await this.reply(
        m.chat,
        `👍 +${bonusXp} XP\n` +
          `It's @${room.curr.split("@")[0]}'s turn\n` +
          `Next start: *${room.filter(answer).toUpperCase()}... ?*\n` +
          `Reply to answer, or type "nyerah" to give up.\n` +
          `XP collected: ${room.win_point}\n` +
          `Remaining:\n${
            this.readmore +
            players.map((jid, i) => `${i + 1}. ${users[jid].name}`).join("\n")
          }`,
        m
      );

      room.diam = true;
      room.kata = answer;
      const nextUser = room.curr;
      const msg = await conn.preSudo("nextkata", nextUser, m);
      this.ev.emit("messages.upsert", msg);
      return true;
    }
  } else {
    // Other players trying to answer
    if (
      !m.quoted ||
      !m.quoted.fromMe ||
      !m.quoted.isBaileys ||
      !/(Mulai|Tersisa) ?:/i.test(m.quoted.text)
    )
      return true;
    if (room.quoted.id === room.chat.id) {
      if (room.eliminated.includes(m.sender)) {
        m.reply(`_You are eliminated. Wait until the game finishes._`);
      } else if (players.includes(m.sender)) {
        m.reply(`_It's not your turn!_`);
      } else {
        m.reply(`_You are not in this game. Wait for the next round!_`);
      }
    } else m.reply(`_That question has passed!_`);
  }

  return true;
};

module.exports = handler;

// Helper: generate a word of length ≥ 3
async function genKata() {
  let data = await skata.kata();
  let word = data.kata;
  while (word.length < 3) {
    data = await skata.kata();
    word = data.kata;
  }
  return word;
}

// Helper: random integer between min and max
function rwd(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
