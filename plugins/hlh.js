const handler = async (m, { command, text }) => {
  try {
    // Extract the vowel to use for replacement
    const vowel = command.match(/^h([aiueo])l\1h/i)[1].toLowerCase();

    // Get text from quoted message or direct input
    let content = m.quoted?.text || text || m.text;

    if (!content) {
      return m.reply(
        "Please provide text or quote a message!\nExample: .halah hello world"
      );
    }

    // Create regex patterns for both lowercase and uppercase vowels
    const vowelPattern = new RegExp(`[${vowel}${vowel.toUpperCase()}]`, "g");
    const allVowelsPattern = /[aiueoAIUEO]/g;

    // Replace vowels while preserving case
    const transformed = content.replace(allVowelsPattern, (match) => {
      return match === match.toLowerCase()
        ? vowel.toLowerCase()
        : vowel.toUpperCase();
    });

    // Send the transformed text
    await m.reply(transformed);
  } catch (error) {
    console.error("Vowel Replacement Error:", error);
    m.reply(
      "⚠️ An error occurred while processing the text. Please try again."
    );
  }
};

// Command help - generates for all vowels
handler.help = [..."aiueo"].map(
  (v) =>
    `h${v}l${v}h <text>` +
    `\nReplaces all vowels with ${v.toUpperCase()}/${v.toLowerCase()}`
);

handler.tags = ["tools", "fun"];
handler.command = /^h([aiueo])l\1h$/i;

module.exports = handler;
