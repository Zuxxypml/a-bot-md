const { quotes } = require("../lib/scrape");

const handler = async (m, { conn, usedPrefix, command, args }) => {
  // Available quote categories
  const categories = [
    "love",
    "longing",
    "dream",
    "loneliness",
    "patience",
    "sadness",
    "marriage",
    "freedom",
  ];

  // Help message
  const helpMsg =
    `📜 *Quote Categories*\n\n` +
    `Usage: ${usedPrefix}${command} <category>\n\n` +
    `Available categories:\n` +
    `${categories
      .map((cat) => `• ${cat.charAt(0).toUpperCase() + cat.slice(1)}`)
      .join("\n")}\n\n` +
    `Example: ${usedPrefix}${command} love`;

  if (!args[0]) throw helpMsg;

  const category = args[0].toLowerCase();

  if (!categories.includes(category)) {
    throw `⚠️ Invalid category!\n\n${helpMsg}`;
  }

  try {
    // Fetch quotes
    const res = await quotes(category);
    const quotesList = res.data;

    if (!quotesList || quotesList.length === 0) {
      throw "No quotes found for this category. Try another one.";
    }

    // Select random quote
    const randomQuote =
      quotesList[Math.floor(Math.random() * quotesList.length)];
    const { author, bio, quote } = randomQuote;

    // Send formatted quote
    await conn.reply(
      m.chat,
      `💬 *${category.charAt(0).toUpperCase() + category.slice(1)} Quote*\n\n` +
        `"${quote}"\n\n` +
        `— ${author}${bio ? ` (${bio})` : ""}`,
      m
    );
  } catch (error) {
    console.error("Quote error:", error);
    throw "Failed to fetch quotes. Please try again later.";
  }
};

handler.help = ["quote <category>"];
handler.tags = ["quotes", "education"];
handler.command = /^(quote|quotes|bijak)$/i;

module.exports = handler;
