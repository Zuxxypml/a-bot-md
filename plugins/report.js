let handler = async (m, { conn, text, usedPrefix }) => {
  // Usage instructions
  const usage =
    `How to report an issue:\n\n` +
    `1. Reply to the error message\n` +
    `2. Type the report text\n\n` +
    `Example:\n` +
    `${usedPrefix}report Instagram feature is not working`;

  // Prevent “bug” keyword misuse
  const isBug = /bug/i.test(text);

  // Validate input
  if (!text || !m.quoted || !m.quoted.text || isBug) {
    throw usage;
  }

  // Send a fake reply to the bot owner with the report details
  const ownerJid = global.owner[0] + "@s.whatsapp.net";
  conn.fakeReply(
    ownerJid,
    `*[REPORT]*\nMessage: ${text}`,
    m.sender,
    m.quoted.text,
    m.chat
  );

  // Acknowledge to the user
  await conn.reply(
    m.chat,
    "_Your report has been sent to the bot owner._\n\nThank you! 😊",
    m
  );
};

handler.help = ["report (reply)"];
handler.tags = ["main"];
handler.command = /^(report|lapor)$/i;

// Disable default failure message
handler.fail = null;

module.exports = handler;
