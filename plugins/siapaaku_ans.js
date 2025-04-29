const similarity = require("similarity");
const threshold = 0.72;

let handler = (m) => m;

handler.before = async function (m) {
  const chatId = m.chat;

  // Only proceed if the quoted message is from the bot, is a quiz prompt, and contains "siapasih"
  if (
    !m.quoted ||
    !m.quoted.fromMe ||
    !m.quoted.isBaileys ||
    !/siapasih/i.test(m.quoted.text)
  )
    return true;

  // Initialize the quiz store if needed
  this.siapaaku = this.siapaaku || {};

  // If there's no active quiz for this chat
  if (!(chatId in this.siapaaku)) {
    return m.reply("❗ That question has already ended.");
  }

  // Only handle replies to the current quiz question
  const [quizMsg, quizData, xpAmount, timeoutId] = this.siapaaku[chatId];
  if (m.quoted.id !== quizMsg.id) return true;

  const { result } = JSON.parse(JSON.stringify(quizData));

  // Ignore help requests or empty replies
  if (/(^$|\.siapa|bantuan)/i.test(m.text)) return true;

  const userAnswer = m.text.trim().toLowerCase();
  const correctAnswer = result.answer.trim().toLowerCase();

  if (userAnswer === correctAnswer) {
    // Correct!
    global.db.data.users[m.sender].exp += xpAmount;
    this.reply(m.chat, `✅ Correct!\n+${xpAmount} XP`, m);

    // Delete the quiz prompt message
    this.sendMessage(m.chat, { delete: quizMsg.key }).catch(() => {});

    // Clear timeout and remove quiz state
    clearTimeout(timeoutId);
    delete this.siapaaku[chatId];
  } else if (similarity(userAnswer, correctAnswer) >= threshold) {
    // Close but not exact
    m.reply("🤏 Almost there!");
  } else {
    // Wrong answer
    m.reply("❌ Incorrect!");
  }

  return true;
};

handler.exp = 0;

module.exports = handler;
