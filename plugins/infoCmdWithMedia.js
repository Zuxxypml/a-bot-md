module.exports = Object.assign(
  async function handler(m, { conn, text }) {
    // Get hash from message or quoted message
    let hash = text;
    if (m.quoted && m.quoted.fileSha256) {
      hash = Buffer.from(m.quoted.fileSha256).toString("hex");
    }
    if (!hash) throw "Please provide a hash or quote a sticker/media";

    // Look up sticker in database
    let sticker = global.db.data.sticker?.[hash];
    if (!sticker) throw "Media not found in database";

    // Format creator information
    const creatorInfo = `
*Creator Name:* ${conn.getName(sticker.creator) || "Unknown"}
*Creator Number:* ${splitM(sticker.creator)}
*Creator JID:* ${sticker.creator}`;

    // Format mentioned users information if any
    let mentionedInfo = "";
    if (sticker.mentionedJid?.length > 0) {
      mentionedInfo =
        `\n*Mentioned Users (${sticker.mentionedJid.length}):*\n` +
        sticker.mentionedJid
          .map(
            (v, i) =>
              `  ${i + 1}. ${conn.getName(v) || "Unknown"} (${splitM(v)})\n` +
              `     JID: ${v}`
          )
          .join("\n\n");
    }

    // Compose final message
    const infoMessage = `
*Sticker/Media Information*

*File Hash (SHA256):* ${hash}
*Command Text:* ${sticker.text || "None"}
*Created At:* ${formatDate(sticker.at)}
*Locked Status:* ${sticker.locked ? "🔒 Locked" : "🔓 Unlocked"}

*Creator Information:*
${creatorInfo}
${mentionedInfo}
`.trim();

    await m.reply(infoMessage);
  },
  {
    help: ["infocmd <hash>", "infocmd (as reply to sticker/media)"],
    tags: ["database", "tools"],
    command: ["infocmd", "stickerinfo", "mediainfo"],
    usage: "Get information about a sticker/media command",
  }
);

/**
 * Formats a date object into readable string
 * @param {Date} date
 * @returns {String}
 */
function formatDate(date) {
  return new Date(date).toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Extracts the number portion from a JID
 * @param {String} jid
 * @returns {String}
 */
function splitM(jid) {
  return jid?.split("@")?.[0] || "Unknown";
}
