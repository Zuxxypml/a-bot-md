const { getDevice } = require("@adiwajshing/baileys");

let handler = async (m) => {
  if (!m.quoted && !m.key) {
    throw "Please reply to a message to check the device.";
  }

  let messageId = m.quoted ? m.quoted.id : m.key.id;
  let device = await getDevice(messageId);
  m.reply(`Device used: ${device}`);
};

handler.help = ["device"];
handler.tags = ["tools"];
handler.command = /^(device)$/i;
handler.group = true; // Only works in groups

module.exports = handler;
