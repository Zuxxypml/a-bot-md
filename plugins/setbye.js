let handler = async (
  m,
  { conn, text, isROwner, isOwner, command, usedPrefix }
) => {
  // Ensure the text includes the @user placeholder
  if (!text || !/@user/i.test(text)) {
    throw `Please provide a message containing the @user placeholder!\n\n@user will be replaced with the mentioned user.\n\nExample:\n${
      usedPrefix + command
    } Goodbye @user`;
  }

  // If using the global variant, only the real owner or owner can set it
  if (/global/i.test(command)) {
    if (isROwner) {
      global.conn.bye = text;
    } else if (isOwner) {
      conn.bye = text;
    } else {
      throw "❌ Only the bot owner can set a global bye message.";
    }
  } else {
    // Otherwise, set a per-group bye message
    global.db.data.chats[m.chat].sBye = text;
  }

  // Acknowledge success
  m.reply(
    "✅ Bye message set successfully!\nRemember: Use @user to mention the leaving user."
  );
};

handler.help = ["setbye <text>", "setbyeglobal <text>"];
handler.tags = ["group"];
handler.command = /^setbye(global)?$/i;
handler.admin = true;
handler.rowner = true;

module.exports = handler;
