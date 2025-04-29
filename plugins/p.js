let handler = async (m, { conn, text, usedPrefix, command }) => {
  // Construct a delete request for the triggering message
  const deleteMessage = {
    delete: {
      remoteJid: m.key.remoteJid,
      fromMe: false,
      id: m.key.id,
      participant: m.sender,
    },
  };

  // Delete the message (e.g., "p")
  await conn.sendMessage(m.chat, deleteMessage);

  // Reply with a sassy response
  conn.sendMessage(
    m.chat,
    { text: "*At least say salam, dude 😹*" },
    { quoted: m, ephemeralExpiration: global.ephemeral }
  );
};

// Triggered when someone sends just "p"
handler.customPrefix = /^(p)$/i;
handler.command = new RegExp(); // Empty RegExp to allow customPrefix to work alone
handler.fail = null;

module.exports = handler;
