const path = require("../src/grouplink.json");
const groupLinks = path.map((v, i) => `Group ${i + 1}\n${v}`).join("\n\n");

const handler = async (
  m,
  { conn, args, usedPrefix, command, isAdmin, isOwner }
) => {
  if (m.isGroup) {
    // Admin check for group commands
    if (!(isAdmin || isOwner)) {
      await conn.reply(m.chat, "⚠️ This command requires admin privileges", m);
      return;
    }

    // Validate input
    const action = (args[0] || "").toLowerCase();
    if (!["open", "close"].includes(action)) {
      const helpMessage =
        `Please specify an action:\n\n` +
        `• ${usedPrefix + command} open - Open group chat\n` +
        `• ${usedPrefix + command} close - Close group chat`;
      return conn.reply(m.chat, helpMessage, m);
    }

    try {
      // Map actions to WhatsApp group settings
      const settingsMap = {
        open: "not_announcement",
        close: "announcement",
      };

      await conn.groupSettingUpdate(m.chat, settingsMap[action]);

      const confirmation =
        action === "open"
          ? "🔓 Group chat has been opened for all members"
          : "🔒 Group chat has been closed (only admins can send messages)";

      await conn.reply(m.chat, confirmation, m);
    } catch (error) {
      console.error("Group Setting Error:", error);
      await conn.reply(
        m.chat,
        "⚠️ Failed to update group settings. Please try again later.",
        m
      );
    }
  } else {
    // Private chat response with group links
    const welcomeMessage =
      `🌟 Join our community groups and have fun with other users!\n\n` +
      `Here are our available groups:\n\n${groupLinks}\n\n` +
      `Choose one and start chatting!`;

    await conn.reply(m.chat, welcomeMessage, m);
  }
};

// Command configuration
handler.help = [
  "group open - Open group chat for all members",
  "group close - Close group (only admins can send messages)",
];
handler.tags = ["group", "admin"];
handler.command = /^(group|gc|groupsetting)$/i;

module.exports = handler;
