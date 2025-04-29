const handler = async (m, { conn, text, usedPrefix, command }) => {
  // If no question provided
  if (!text) {
    const exampleQuestions = [
      "Will I be rich?",
      "Is it going to rain tomorrow?",
      "Does she like me?",
      "Am I going to pass this exam?",
      "Should I take this job?",
    ];
    const example = pickRandom(exampleQuestions);
    return conn.reply(
      m.chat,
      `🎱 *Magic 8-Ball* 🎱\n\n` +
        `Ask me a yes/no question and I'll reveal your fate!\n\n` +
        `Example: *${example}*\n` +
        `How to use: *${usedPrefix}8ball [your question]*\n\n` +
        `Try asking about your future, relationships, or decisions!`,
      m
    );
  }

  // Clean the question text
  const question = text.replace(/\?+$/, "").trim();

  // Answer categories with varied responses
  const answerSets = {
    positive: [
      "It is certain",
      "Definitely yes",
      "You may rely on it",
      "As I see it, yes",
      "Outlook good",
      "Signs point to yes",
    ],
    neutral: [
      "Reply hazy, try again",
      "Ask again later",
      "Better not tell you now",
      "Cannot predict now",
      "Concentrate and ask again",
      "50/50 chance",
    ],
    negative: [
      "Don't count on it",
      "My reply is no",
      "My sources say no",
      "Outlook not so good",
      "Very doubtful",
      "No way",
    ],
    funny: [
      "The stars say maybe",
      "Only on Tuesdays",
      "When pigs fly",
      "In your dreams!",
      "The answer may surprise you",
      "Error 404: Answer not found",
    ],
  };

  // Combine all answers for random selection
  const allAnswers = [
    ...answerSets.positive,
    ...answerSets.neutral,
    ...answerSets.negative,
    ...answerSets.funny,
  ];

  // Get random answer
  const answer = pickRandom(allAnswers);

  // Format the mystical reply
  const replyMsg =
    `🔮 *Your Question:* ${question}?\n\n` +
    `🎱 *The Magic 8-Ball says...*\n` +
    `✨ *${answer}* ✨`;

  await conn.reply(m.chat, replyMsg, m, {
    contextInfo: {
      mentionedJid: m.mentionedJid || [],
    },
  });
};

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

handler.help = ["8ball <question>"];
handler.tags = ["fun", "game"];
handler.command = /^(8ball|magic8|ask|fortune)$/i;
handler.owner = false;

module.exports = handler;
