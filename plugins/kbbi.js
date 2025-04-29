const { kbbi } = require("@bochilteam/scraper");

const handler = async (m, { text, usedPrefix, command }) => {
  // Help message if no keyword provided
  if (!text) {
    const exampleWords = ["makan", "pulang", "bahagia"];
    const example =
      exampleWords[Math.floor(Math.random() * exampleWords.length)];
    return m.reply(
      `📚 *KBBI Dictionary*\n\n` +
        `Please provide a word to look up\n\n` +
        `Example: *${usedPrefix}${command} ${example}*\n` +
        `Try: *${usedPrefix}${command} ${text || "kata"}*`
    );
  }

  try {
    // Fetch KBBI data
    const res = await kbbi(text);

    if (!res || !res.length) {
      return m.reply(`No dictionary entries found for "${text}"`);
    }

    // Format the response
    let message = `📚 *KBBI Results for "${text}"*\n\n`;

    res.forEach((entry) => {
      message += `🔍 *${entry.title}*\n`;
      message += entry.means.map((meaning) => `• ${meaning}`).join("\n");
      message += "\n\n";
    });

    // Add legend
    message +=
      `*Legend*:\n` +
      `p = Particle (prepositions, conjunctions, interjections)\n` +
      `n = Noun (kata benda)\n` +
      `v = Verb (kata kerja)\n` +
      `a = Adjective (kata sifat)`;

    await m.reply(message);
  } catch (error) {
    console.error("KBBI Error:", error);
    m.reply(
      `❌ Failed to fetch dictionary data\n\n` +
        `Possible reasons:\n` +
        `- The word doesn't exist in KBBI\n` +
        `- Server is temporarily unavailable\n` +
        `- Connection issues`
    );
  }
};

handler.help = ["kbbi <word>"];
handler.tags = ["education", "tools"];
handler.command = /^kbbi$/i;
handler.example = `${usedPrefix}kbbi belajar`;

module.exports = handler;
