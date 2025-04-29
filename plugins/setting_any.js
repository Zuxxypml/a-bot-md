let handler = async (m, { conn, text, usedPrefix }) => {
  if (!text)
    throw `❗ Please specify a setting name.\n\nUsage:\n${usedPrefix}set <setting>`;

  const title = text.toUpperCase();
  const message = `*${title}*\nWould you like to turn this setting ON or OFF?`;
  const footer = "Select an option below:";

  // Send two buttons: On and Off
  await conn.sendButton(
    m.chat,
    message,
    footer,
    2,
    ["On", `${usedPrefix}on ${text}`, "Off", `${usedPrefix}off ${text}`],
    m
  );
};

handler.command = /^set$/i;

module.exports = handler;
