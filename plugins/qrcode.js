const qrcode = require("qrcode");

let handler = async (m, { conn, text, usedPrefix }) => {
  if (!text) {
    return m.reply(
      `❗ Please provide text to encode.\n\nExample:\n${usedPrefix}qr I love you`
    );
  }
  // Generate a QR code data URL (limit to 2048 chars)
  const dataUrl = await qrcode.toDataURL(text.slice(0, 2048), { scale: 8 });
  // Send as an image file
  await conn.sendFile(m.chat, dataUrl, "qrcode.png", "Here’s your QR code!", m);
};

handler.help = ["qrcode <text>"];
handler.tags = ["maker"];
handler.command = /^qr(code)?$/i;
handler.limit = true;

module.exports = handler;
