module.exports = {
  async handler(m) {
    if (
      !global.db.data.sticker ||
      Object.keys(global.db.data.sticker).length === 0
    ) {
      return m.reply("No sticker commands found in database. 🤷‍♂️");
    }

    const stickerList = Object.entries(global.db.data.sticker)
      .map(([key, value], index) => {
        const lockedIndicator = value.locked ? "🔒 " : "";
        return `${index + 1}. ${lockedIndicator}${key}: ${
          value.text || "<no text>"
        }`;
      })
      .join("\n");

    const mentionedJids = Object.values(global.db.data.sticker).flatMap(
      (x) => x.mentionedJid || []
    );

    return m.reply(
      `
*STICKER COMMAND LIST*
Total: ${Object.keys(global.db.data.sticker).length}
🔒 = Locked command

\`\`\`
${stickerList}
\`\`\`
`.trim(),
      null,
      {
        contextInfo: {
          mentionedJid: mentionedJids,
        },
      }
    );
  },
  help: ["List all sticker commands"],
  tags: ["database", "sticker"],
  command: ["listcmd", "liststicker", "stickerlist"],
};
