const diceStickers = [
  "https://tinyurl.com/ygms8wvy",
  "https://tinyurl.com/yhdyhnap",
  "https://tinyurl.com/yfwjbou7",
  "https://tinyurl.com/yh3e3ogt",
  "https://tinyurl.com/yfmhpvxs",
  "https://tinyurl.com/ygpxka9q",
].map((url) => url.replace("https://", "https://")); // Fix any malformed URLs

let handler = async (m, { conn }) => {
  try {
    // Get random dice sticker
    const randomSticker =
      diceStickers[Math.floor(Math.random() * diceStickers.length)];

    // Send sticker with additional metadata
    await conn.sendFile(
      m.chat,
      randomSticker,
      "dice.webp",
      `🎲 You rolled a ${diceStickers.indexOf(randomSticker) + 1}!`,
      m,
      false,
      {
        mimetype: "image/webp",
        ephemeralExpiration: 24 * 60 * 60, // 24 hours
        contextInfo: {
          externalAdReply: {
            title: "Dice Roll Game",
            body: "Try your luck!",
            thumbnailUrl: randomSticker,
            sourceUrl: "https://example.com/dice-game",
          },
        },
      }
    );

    // Log the roll
    console.log(
      `Dice rolled in chat ${m.chat}: ${
        diceStickers.indexOf(randomSticker) + 1
      }`
    );
  } catch (error) {
    console.error("Error sending dice sticker:", error);
    await m.reply("Oops! Couldn't roll the dice. Please try again later.");
  }
};

// Command configuration
handler.help = ["dadu", "dice"];
handler.tags = ["game", "fun", "sticker"];
handler.command = /^(dadu|dice|roll)$/i; // Multiple command aliases
handler.limit = true; // Prevent spam
handler.group = true; // Only works in groups
handler.game = true; // Mark as game command

module.exports = handler;
