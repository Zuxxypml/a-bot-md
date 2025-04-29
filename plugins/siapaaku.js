const fs = require("fs");

// Game configuration
const TIMEOUT_MS = 60000; // 60 seconds to answer
const BONUS_XP = 400; // XP reward for correct answer

let handler = async (m, { conn, usedPrefix }) => {
  // Ensure the quiz state object exists
  conn.siapaaku = conn.siapaaku || {};
  const chatId = m.chat;

  // If there's already an active question in this chat
  if (chatId in conn.siapaaku) {
    // If the question hasn't been answered yet, remind the user
    if (conn.siapaaku[chatId].length !== 0) {
      return conn.reply(
        m.chat,
        "There is still an unanswered question in this chat.",
        conn.siapaaku[chatId][0]
      );
    }
    // Clean up stale state
    delete conn.siapaaku[chatId];
    throw false;
  }

  // Load the question bank
  const questionBank = JSON.parse(
    fs.readFileSync("./src/scrap/siapaaku.json", "utf8")
  );
  // Pick a random question
  const quizData =
    questionBank[Math.floor(Math.random() * questionBank.length)];
  const questionText = quizData.result.question;

  // Build the prompt caption
  const caption = `
*Question:* ${questionText}

*Time to answer:* ${(TIMEOUT_MS / 1000).toFixed(0)} seconds
*Reward:* +${BONUS_XP} XP

Reply to this message with your answer!
Use *${usedPrefix}siapasih* for a hint (costs 1 limit).
`.trim();

  // Send the question and store its state
  const sentMsg = await conn.reply(m.chat, caption, m);
  conn.siapaaku[chatId] = [
    sentMsg, // The sent message object (for replies/deletion)
    quizData, // The quiz data (question + answer)
    BONUS_XP, // XP reward
    setTimeout(() => {
      // Time's up: reveal the answer and clean up
      if (conn.siapaaku[chatId]) {
        conn.reply(
          m.chat,
          `⏰ Time's up!\nThe correct answer was *${quizData.result.answer}*.`,
          conn.siapaaku[chatId][0]
        );
        conn.sendMessage(m.chat, { delete: sentMsg.key }).catch(() => {});
        delete conn.siapaaku[chatId];
      }
    }, TIMEOUT_MS),
  ];
};

handler.help = ["siapaaku"];
handler.tags = ["game"];
handler.command = /^siapaaku$/i;
handler.limit = false;
handler.group = true;

module.exports = handler;
