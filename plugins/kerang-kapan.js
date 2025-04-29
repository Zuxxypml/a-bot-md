const handler = async (m, { conn, text, usedPrefix, command }) => {
  // If no question provided
  if (!text) {
    const exampleQuestions = [
      "will I get rich?",
      "will I find love?",
      "will this pandemic end?",
      "will I pass my exam?",
    ];
    const example = pickRandom(exampleQuestions);
    return conn.reply(
      m.chat,
      `⏳ *Future Predictor* ⏳\n\n` +
        `Ask when something will happen\n\n` +
        `Example: *${usedPrefix}${command} ${example}*\n` +
        `Usage: *${usedPrefix}${command} [your question]*\n\n` +
        `Get mystical predictions about your future!`,
      m
    );
  }

  // Time units with emojis
  const timeUnits = [
    { unit: "second", emoji: "⏱️", max: 60 },
    { unit: "minute", emoji: "🕑", max: 60 },
    { unit: "hour", emoji: "🕒", max: 24 },
    { unit: "day", emoji: "📅", max: 30 },
    { unit: "week", emoji: "🗓️", max: 4 },
    { unit: "month", emoji: "📆", max: 12 },
    { unit: "year", emoji: "🎉", max: 10 },
    { unit: "decade", emoji: "⌛", max: 1 },
  ];

  // Select random time unit
  const randomUnit = pickRandom(timeUnits);
  const duration = Math.floor(Math.random() * randomUnit.max) + 1;
  const plural = duration > 1 ? "s" : "";

  // Generate prediction
  const prediction =
    `🔮 *Prediction for:* ${text}\n\n` +
    `✨ *The stars say...*\n` +
    `In about ${duration} ${randomUnit.unit}${plural} ${randomUnit.emoji}\n\n` +
    `(This is just for fun! 😉)`;

  await conn.reply(m.chat, prediction, m, {
    contextInfo: {
      mentionedJid: m.mentionedJid || [],
    },
  });
};

// Helper function
function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

handler.help = ["when <question>"];
handler.tags = ["fun", "game"];
handler.command = /^(when|kapan(kah)?)$/i;

module.exports = handler;
