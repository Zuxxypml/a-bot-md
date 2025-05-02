let handler = async (m, { text, usedPrefix }) => {
  if (!text) {
    throw `❗ Please specify a setting to toggle.\n\nUsage:\n${usedPrefix}set <setting>\nExample: ${usedPrefix}set welcome`;
  }

  const key = text.toLowerCase().trim();
  const chat = (global.db.data.chats[m.chat] ||= {});
  const user = (global.db.data.users[m.sender] ||= {});

  // Combined scope
  const combinedScope = {
    // group-level settings
    antilink: chat,
    welcome: chat,
    detect: chat,
    viewonce: chat,
    delete: chat,
    game: chat,

    // user-level settings
    autolevelup: user,
    autosticker: user,
    useDocument: user,
  };

  if (!(key in combinedScope)) {
    return m.reply(`❌ Unknown or unsupported setting: *${key}*`);
  }

  // Toggle the value
  combinedScope[key][key] = !combinedScope[key][key];
  const newState = combinedScope[key][key] ? "ON ✅" : "OFF ❌";

  m.reply(`*${key.toUpperCase()}* has been toggled: ${newState}`);
};

handler.command = /^set$/i;
handler.group = true;
handler.admin = true;

module.exports = handler;
