let handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    // Validate input
    if (!text) {
      throw (
        `⚠️ *Usage:* ${usedPrefix + command} @mention message\n\n` +
        `Example:\n${usedPrefix + command} @1234567890 Hello!`
      );
    }

    // Check for mentions
    const mentions = conn.parseMention(text);
    if (!mentions || mentions.length === 0) {
      throw (
        `❌ No valid mentions found!\n` +
        `Please include at least one @mention in your message.\n` +
        `Example: ${usedPrefix + command} @1234567890 Hi there!`
      );
    }

    // Validate phone numbers
    const invalidMentions = mentions.filter((jid) => {
      const number = jid.replace(/@.+/, "");
      return !/^[0-9]+$/.test(number) || number.length < 8;
    });

    if (invalidMentions.length > 0) {
      throw (
        `❌ Invalid WhatsApp number(s) detected:\n` +
        invalidMentions.map((jid) => `- ${jid}`).join("\n") +
        "\n\n" +
        `Please use valid phone numbers in international format.`
      );
    }

    // Send message with mentions
    await conn.sendMessage(
      m.chat,
      {
        text: text,
        mentions: mentions,
      },
      {
        quoted: m,
        ephemeralExpiration: 24 * 60 * 60, // 24 hours
      }
    );

    // Log success
    console.log(`Mention sent by ${m.sender} to ${mentions.length} user(s)`);
  } catch (error) {
    console.error("Mention handler error:", error);
    m.reply(error.toString());
  }
};

handler.help = ["mention @number message"];
handler.tags = ["tools", "group"];
handler.command = /^(mention|reply|tag)$/i;

// Security restrictions
handler.group = true;
handler.botAdmin = false;
handler.admin = false;
handler.limit = true;

module.exports = handler;
