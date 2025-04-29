const fs = require("fs");
const path = require("path");

let handler = async (m, { usedPrefix, command, text }) => {
  // Validate input
  if (!text) {
    const example = `${usedPrefix + command} menu`;
    return m.reply(`Please specify a plugin filename.\nExample: *${example}*`);
  }

  // Security: Prevent directory traversal
  if (text.includes("../") || text.includes("..\\")) {
    return m.reply("Invalid filename - directory traversal not allowed");
  }

  // Normalize filename
  const filename = path.join(__dirname, `${text.replace(/\.js$/i, "")}.js`);

  try {
    // Check if file exists
    if (!fs.existsSync(filename)) {
      // List available plugins if requested file doesn't exist
      const listPlugins = fs
        .readdirSync(__dirname)
        .filter((file) => file.endsWith(".js"))
        .map((file) => file.replace(/\.js$/i, ""))
        .filter((file) => file !== "index" && file !== "_template");

      return m.reply(
        `Plugin *${text}* not found!\n\n` +
          `Available plugins:\n` +
          `${listPlugins.join(", ")}\n\n` +
          `Usage: *${usedPrefix + command} pluginname*`
      );
    }

    // Read and send file content
    const content = fs.readFileSync(filename, "utf8");

    // Truncate very large files to prevent flooding
    const MAX_LENGTH = 15000;
    if (content.length > MAX_LENGTH) {
      await m.reply(
        `⚠️ File is too large (${content.length} chars), showing first ${MAX_LENGTH} characters:`
      );
      return m.reply(content.substring(0, MAX_LENGTH) + "\n... [TRUNCATED]");
    }

    return m.reply(content);
  } catch (error) {
    console.error("Plugin Read Error:", error);
    return m.reply(`Failed to read plugin: ${error.message}`);
  }
};

handler.help = ["getplugin <filename> - Get plugin file content"];
handler.tags = ["owner"];
handler.command = /^(getplugin|get ?plugin|gp)$/i;
handler.rowner = true;

module.exports = handler;
