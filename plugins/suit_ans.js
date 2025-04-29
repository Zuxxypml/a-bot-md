let handler = (m) => m;
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

handler.before = async function (m) {
  this.suit = this.suit || {};
  if (db.data.users[m.sender].suit < 0) db.data.users[m.sender].suit = 0;

  let room = Object.values(this.suit).find(
    (room) => room.id && room.status && [room.p, room.p2].includes(m.sender)
  );
  let mmr = rwd(20, 30);

  if (room) {
    let win = "";
    let tie = false;

    // Handle accept/reject in group
    if (
      m.sender === room.p2 &&
      /^(accept|yes|ok|y|no|reject|later|can't)/i.test(m.text) &&
      m.isGroup &&
      room.status === "wait"
    ) {
      if (/^(no|reject|later|can't)/i.test(m.text)) {
        this.reply(
          m.chat,
          `@${room.p2.split`@`[0]} declined the game. Game canceled.`,
          m
        );
        delete this.suit[room.id];
        return true;
      }
      room.status = "play";
      room.asal = m.chat;
      clearTimeout(room.waktu);

      m.reply(
        `Game invitation sent to:\n` +
          `@${room.p.split`@`[0]} and @${room.p2.split`@`[0]}\n\n` +
          `Please make your choice in your private chat.`
      );

      if (!room.pilih)
        this.reply(
          room.p,
          `Please choose:\n\nRock/Paper/Scissors\n\nWin +${room.poin}XP\nLose -${room.poin_lose}XP`,
          m
        );
      await delay(1500);
      if (!room.pilih2)
        this.reply(
          room.p2,
          `Please choose:\n\nRock/Paper/Scissors\n\nWin +${room.poin}XP\nLose -${room.poin_lose}XP`,
          m
        );

      room.waktu_milih = setTimeout(() => {
        if (!room.pilih && !room.pilih2) {
          this.reply(m.chat, `No one made a move. Game canceled.`);
        } else if (!room.pilih || !room.pilih2) {
          win = !room.pilih ? room.p2 : room.p;
          this.reply(
            m.chat,
            `@${
              (room.pilih ? room.p2 : room.p).split`@`[0]
            } did not choose. Game over.`,
            m
          );
          db.data.users[win === room.p ? room.p : room.p2].exp += room.poin;
          db.data.users[win === room.p ? room.p2 : room.p].exp -=
            room.poin_lose;
          this.fakeReply(
            m.chat,
            `+${room.poin} XP`,
            win,
            random([
              `So... I win??`,
              `Yay, I won! Thanks!`,
              `Panicked? You bet!`,
              `Surprised?`,
            ]),
            "status@broadcast"
          );
        }
        delete this.suit[room.id];
        return true;
      }, room.timeout);
    }

    let j = m.sender === room.p;
    let j2 = m.sender === room.p2;
    let rock = /rock/i;
    let paper = /paper/i;
    let scissors = /scissors/i;
    let reg = /^(rock|paper|scissors)/i;

    // Player 1 choice in private
    if (
      j &&
      reg.test(m.text) &&
      !reg.test(m.msg.selectedButtonId) &&
      !room.pilih &&
      !m.isGroup
    ) {
      room.pilih = reg.exec(m.text.toLowerCase())[0];
      room.text = m.text;
      m.reply(
        `You chose ${m.text}${
          !room.pilih2 ? `\n\nWaiting for opponent...` : ""
        }`
      );
      if (!room.pilih2)
        this.reply(room.p2, `_Opponent has chosen_\nYour turn.`, 0);
    }

    await delay(1500);

    // Player 2 choice in private
    if (
      j2 &&
      reg.test(m.text) &&
      !reg.test(m.msg.selectedButtonId) &&
      !room.pilih2 &&
      !m.isGroup
    ) {
      room.pilih2 = reg.exec(m.text.toLowerCase())[0];
      room.text2 = m.text;
      m.reply(
        `You chose ${m.text}${!room.pilih ? `\n\nWaiting for opponent...` : ""}`
      );
      if (!room.pilih)
        this.reply(room.p, `_Opponent has chosen_\nYour turn.`, 0);
    }

    let choice1 = room.pilih;
    let choice2 = room.pilih2;

    // When both have chosen, determine outcome
    if (choice1 && choice2) {
      clearTimeout(room.waktu_milih);

      if (rock.test(choice1) && scissors.test(choice2)) win = room.p;
      else if (rock.test(choice1) && paper.test(choice2)) win = room.p2;
      else if (scissors.test(choice1) && paper.test(choice2)) win = room.p;
      else if (scissors.test(choice1) && rock.test(choice2)) win = room.p2;
      else if (paper.test(choice1) && rock.test(choice2)) win = room.p;
      else if (paper.test(choice1) && scissors.test(choice2)) win = room.p2;
      else if (choice1 === choice2) tie = true;

      this.reply(
        room.asal,
        `_*Game Result*_` +
          `${tie ? "\nTIE!" : ""}\n\n` +
          `@${room.p.split`@`[0]} (${room.text}) ${
            tie
              ? ""
              : room.p === win
              ? `Win\n+${room.poin}XP\n+${mmr}MMR`
              : `Lose\n-${room.poin_lose}XP\n-${mmr / 2}MMR`
          }\n` +
          `@${room.p2.split`@`[0]} (${room.text2}) ${
            tie
              ? ""
              : room.p2 === win
              ? `Win\n+${room.poin}XP\n+${mmr}MMR`
              : `Lose\n-${room.poin_lose}XP\n-${mmr / 2}MMR`
          }`.trim(),
        m
      );

      if (!tie) {
        let winnerId = win === room.p ? room.p : room.p2;
        let loserId = win === room.p ? room.p2 : room.p;
        db.data.users[winnerId].exp += room.poin;
        db.data.users[loserId].exp -= room.poin_lose;
        db.data.users[winnerId].suit += mmr;
        db.data.users[loserId].suit -= mmr / 2;
      }

      delete this.suit[room.id];
    }
  }

  return true;
};

handler.exp = 0;
module.exports = handler;

function rwd(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
