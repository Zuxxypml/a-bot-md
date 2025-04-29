let handler = async (m, { conn, command, text, args }) => {
  if (args.length === 0) {
    return conn.reply(m.chat, "Please enter a number between 0 and 9.", m);
  }

  const userChoice = parseInt(args[0]);
  if (isNaN(userChoice) || userChoice < 0 || userChoice > 9) {
    return conn.reply(
      m.chat,
      "Invalid input! Please pick a number from 0 to 9.",
      m
    );
  }

  const botChoice = pickRandom([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const bonusXP = Math.floor(Math.random() * 3000); // XP reward between 0–2999

  let message = `🎲 *「 GUESS THE NUMBER 」*\n\n`;
  message += `Your Number: ${userChoice}\n`;
  message += `Bot's Number: ${botChoice}\n\n`;

  if (userChoice === botChoice) {
    message += `🎉 Congratulations! You guessed correctly!\n`;
    global.db.data.users[m.sender].exp += bonusXP;
    message += `\n🏆 You earned +${bonusXP} XP!`;
  } else {
    message += `❌ Oops! Your guess was wrong.\n`;
    message += `\nBetter luck next time! ✨`;
  }

  conn.reply(m.chat, message.trim(), m);
};

handler.help = ["guessnumber <0-9>"];
handler.tags = ["game"];
handler.command = /^guessnumber|number$/i;

handler.tigame = true;
handler.group = true;
handler.game = true;
handler.fail = null;

module.exports = handler;

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}
