let handler = async (m, { conn, text }) => {
  // Ensure the user provided a welcome message
  if (!text) {
    throw (
      `❗ Please provide a welcome message!\n\n` +
      `You can use these placeholders:\n` +
      `@user    = mentions the new user\n` +
      `@subject = the group name\n` +
      `@desc    = the group description`
    );
  }
  // Save the welcome template for this chat
  global.db.data.chats[m.chat].sWelcome = text;
  // Acknowledge success
  m.reply(
    `✅ Welcome message set successfully!\n\n` +
      `Placeholders you can use:\n` +
      `@user    = mention the new user\n` +
      `@subject = group name\n` +
      `@desc    = group description`
  );
};

handler.help = ["setwelcome <message>"];
handler.tags = ["owner", "group"];
handler.command = /^setwelcome$/i;

module.exports = handler;
