let handler = async (m, { conn, text, usedPrefix, command }) => {
  // Ensure the user provided text
  if (!text) {
    return m.reply(`❗ Usage: ${usedPrefix}${command} part1|part2`);
  }

  // Split into the visible and hidden parts
  let [visible, hidden] = text.split("|").map((s) => s.trim());
  visible = visible || "";
  hidden = hidden || "";

  // Send message with a "read more" spoiler
  await conn.reply(m.chat, visible + conn.readmore + hidden, m);
};

handler.help = ["readmore <visibleText|hiddenText>"];
handler.tags = ["maker"];
handler.command = /^(spoiler|hidetext|readmore|selengkapnya)$/i;
handler.limit = true;

module.exports = handler;
