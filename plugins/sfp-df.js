const fs = require("fs");

let handler = async (m, { text, usedPrefix, command }) => {
  // Ensure the user provided a filename
  if (!text) {
    throw (
      `❗ Please specify a filename.\n\n` +
      `Usage:\n` +
      `${usedPrefix + command} <filename>\n\n` +
      `Example:\n` +
      `${usedPrefix + command} menu`
    );
  }

  // Save Plugin: reply to a message and run "sfp"
  if (command === "sfp") {
    // Require the user to reply to a message containing the plugin code
    if (!m.quoted || !m.quoted.text) {
      throw "❗ Please reply to the message containing your plugin code!";
    }
    let filePath = `plugins/${text}.js`;
    fs.writeFileSync(filePath, m.quoted.text);
    m.reply(`✅ Plugin saved to ${filePath}`);

    // Delete Plugin: run "df"
  } else if (command === "df") {
    let filePath = `plugins/${text}.js`;
    if (!fs.existsSync(filePath)) {
      throw `❗ Plugin file ${text}.js not found.`;
    }
    fs.unlinkSync(filePath);
    m.reply(`✅ Plugin file ${text}.js deleted successfully.`);
  }
};

handler.help = ["sfp <filename>", "df <filename>"];
handler.tags = ["owner"];
handler.command = /^(sfp|df)$/i;
handler.rowner = true;

module.exports = handler;
