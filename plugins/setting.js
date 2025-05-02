let handler = async (m, { conn, usedPrefix }) => {
  const users = (global.db.data.users[m.sender] ||= {});
  const chats = (global.db.data.chats[m.chat] ||= {});

  const rows = [
    {
      title: `Bot Chat Status (${chats.isBanned ? "Off" : "On"})`,
      description: "Toggle the bot in this chat\nScope: Chat",
      rowId: `${usedPrefix}bot`,
    },
    {
      title: `Auto Level Up (${users.autolevelup ? "On" : "Off"})`,
      description:
        "Automatically level up when XP is sufficient\nScope: Private",
      rowId: `${usedPrefix}set autolevelup`,
    },
    {
      title: `Auto Sticker (${users.autosticker ? "On" : "Off"})`,
      description:
        "Automatically convert received images to stickers\nScope: Private",
      rowId: `${usedPrefix}set autosticker`,
    },
    {
      title: `Send as Document (${users.useDocument ? "On" : "Off"})`,
      description:
        "Send downloaded files as documents instead of media\nScope: Private",
      rowId: `${usedPrefix}set usedocument`,
    },
    {
      title: `Group Game Mode (${chats.game ? "On" : "Off"})`,
      description: "Toggle between chat and game modes\nScope: Group",
      rowId: `${usedPrefix}set game`,
    },
    {
      title: `Welcome Messages (${chats.welcome ? "On" : "Off"})`,
      description: "Greet new members when they join the group\nScope: Group",
      rowId: `${usedPrefix}set welcome`,
    },
    {
      title: `Anti-Link (${chats.antilink ? "On" : "Off"})`,
      description: "Detect and remove group invite links\nScope: Group",
      rowId: `${usedPrefix}set antilink`,
    },
    {
      title: `Admin Change Detection (${chats.detect ? "On" : "Off"})`,
      description: "Notify when group admin status changes\nScope: Group",
      rowId: `${usedPrefix}set detect`,
    },
    {
      title: `View-Once Bypass (${chats.viewonce ? "On" : "Off"})`,
      description:
        "Convert view-once messages into normal messages\nScope: Group",
      rowId: `${usedPrefix}set viewonce`,
    },
    {
      title: `Anti-Delete (${chats.delete ? "On" : "Off"})`,
      description: "Restore messages deleted by members\nScope: Group",
      rowId: `${usedPrefix}set antidelete`,
    },
  ];

  // Remove group-specific settings if not in a group chat
  if (!m.isGroup) rows.splice(4, 6);

  const sections = [{ title: "Bot Settings", rows }];
  const listMessage = {
    buttonText: "Open Settings",
    text: "Please choose an option:",
    sections,
  };

  await conn.sendMessage(m.chat, listMessage, { quoted: m });
};

handler.tags = ["info", "main"];
handler.help = ["setting"];
handler.command = /^setting$/i;

module.exports = handler;
