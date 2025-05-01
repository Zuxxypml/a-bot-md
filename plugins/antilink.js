let handler = async (m, { args, command }) => {
  let chat = global.db.data.chats[m.chat];
  if (!chat) chat = global.db.data.chats[m.chat] = {}; // ensure chat object exists

  if (!args[0]) {
    return m.reply(`⚙️ Usage: *.${command} on* or *.${command} off*`);
  }

  const input = args[0].toLowerCase();

  if (input === "on") {
    chat.antiLink = true;
    m.reply("✅ Anti-Link has been *enabled* in this group.");
  } else if (input === "off") {
    chat.antiLink = false;
    m.reply("❌ Anti-Link has been *disabled* in this group.");
  } else {
    m.reply("❗ Invalid option. Use *on* or *off* only.");
  }
};

handler.help = ["antilink on", "antilink off"];
handler.tags = ["group", "admin"];
handler.command = /^antilink$/i;
handler.group = true;
handler.admin = true;

module.exports = handler;
