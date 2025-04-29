const fs = require("fs");

let handler = async (m, { text, usedPrefix, command }) => {
  // Ensure a filepath argument is provided
  if (!text) {
    throw `Please specify a file path.\n\nUsage:\n${
      usedPrefix + command
    } <filePath>\n\nExample:\n${usedPrefix + command} plugins/menu.js`;
  }
  // Ensure the user replied to a text message
  if (!m.quoted || !m.quoted.text) {
    throw `Please reply to the message whose content you want to save.`;
  }

  const filePath = text.trim();
  fs.writeFileSync(filePath, m.quoted.text);
  m.reply(`✅ Content has been saved to ${filePath}`);
};

handler.help = ["sf <filePath>"];
handler.tags = ["owner"];
handler.command = /^sf$/i;
handler.rowner = true;

module.exports = handler;
