let handler = async (m, { conn, text, usedPrefix }) => {
  // Ensure the user replied to a message
  if (!m.quoted) throw "❗ Please reply to a message to react to it!";

  // Ensure exactly one emoji is provided
  if (!text) throw `📍 Usage:\n${usedPrefix}react <emoji>`;
  if (text.length > 2) throw "❗ Only one emoji is allowed!";

  // Relay the reaction
  conn.relayMessage(
    m.chat,
    {
      reactionMessage: {
        key: {
          id: m.quoted.id,
          remoteJid: m.chat,
          fromMe: true,
        },
        text: text,
      },
    },
    { messageId: m.id }
  );
};

handler.help = ["react <emoji>"];
handler.tags = ["tools"];
handler.command = /^(react)$/i;
handler.limit = true;

module.exports = handler;
