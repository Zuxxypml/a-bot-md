const { pixeldrain } = require("../lib/pixeldrain.js");
const fetch = require("node-fetch");

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text)
    throw `🚨 *Example:* ${usedPrefix}${command} https://pixeldrain.com/u/Un6ru7VS`;

  try {
    // Extract file ID from URL
    const fileId = pixeldrain.extractLink(text);
    if (!fileId)
      throw `🚨 *Invalid link format!*\nUse a link like: https://pixeldrain.com/u/Un6ru7VS`;

    // Get file info from PixelDrain
    const res = await pixeldrain.dl(fileId);
    if (!res || !res.success) throw `🚨 *Failed to fetch file information!*`;

    // Ensure file is downloadable
    if (!res.can_download)
      throw `🚨 *This file is not available for download!*`;

    // Only allow specific MIME types
    const allowedMimeTypes = [
      "video/mp4",
      "image/png",
      "image/jpeg",
      "application/zip",
      "application/pdf",
    ];
    if (!allowedMimeTypes.includes(res.mime_type))
      throw `🚨 *File type not supported!*\nFile type: ${res.mime_type}`;

    let msg = `📥 *P I X E L D R A I N  D O W N L O A D E R*\n\n`;
    msg += `📌 *Name:* ${res.name}\n`;
    msg += `📌 *Size:* ${(res.size / (1024 * 1024)).toFixed(2)} MB\n`;
    msg += `📌 *Type:* ${res.mime_type}\n`;
    msg += `📌 *Uploaded:* ${res.date_upload}\n`;
    msg += `📌 *Downloads:* ${res.downloads}\n`;
    msg += `📌 *Last Viewed:* ${res.date_last_view}\n`;
    msg += `📌 *Link:* ${text}\n`;

    // Send thumbnail if available
    if (res.thumbnail_href) {
      await conn.sendFile(
        m.chat,
        `https://pixeldrain.com/api${res.thumbnail_href}`,
        "thumb.png",
        msg,
        m
      );
    } else {
      await conn.reply(m.chat, msg, m);
    }

    // Send actual file
    await conn.sendMessage(
      m.chat,
      {
        document: { url: res.file },
        fileName: res.name,
        mimetype: res.mime_type,
      },
      { quoted: m }
    );
  } catch (e) {
    throw `🚨 *Error:* ${e}`;
  }
};

handler.help = ["pixeldrain <url>"];
handler.tags = ["downloader"];
handler.command = /^(pixeldrain|pd)$/i;
handler.limit = true;
handler.register = false;
handler.premium = false;

module.exports = handler;
