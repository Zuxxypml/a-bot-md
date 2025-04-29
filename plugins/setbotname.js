// Change Bot Name Command
let handler = async (m, { conn, text }) => {
  // Ensure a new name was provided
  if (!text) throw "❗ Please provide a new name for the bot.";
  try {
    // Update the bot's profile name
    await conn.updateProfileName(text);
    conn.reply(m.chat, "✅ Bot name has been successfully updated!", m);
  } catch (e) {
    console.error(e);
    throw "❌ Failed to update bot name.";
  }
};

handler.help = ["setbotname <new name>"];
handler.tags = ["owner"];
handler.command = /^(setbotname)$/i;
handler.owner = true;

module.exports = handler;
