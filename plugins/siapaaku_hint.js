const handler = async (m, { conn }) => {
  // Initialize quiz store if needed
  conn.siapaaku = conn.siapaaku || {};
  const chatId = m.chat;

  // If there's no active quiz, do nothing
  if (!(chatId in conn.siapaaku)) return false;

  // Get the quiz data and answer
  const [, quizData] = conn.siapaaku[chatId];
  const answer = quizData.result.answer;

  // Replace all consonants with underscores for the puzzle
  const puzzle = answer.replace(/[bcdfghjklmnpqrstvwxyz]/gi, "_");

  // Send the puzzle to the chat
  await m.reply(`Fill in the blanks:\n\`\`\`${puzzle}\`\`\``);
};

handler.command = /^whoami$/i;
handler.help = ["whoami"];
handler.tags = ["quiz"];
handler.limit = true;

module.exports = handler;
