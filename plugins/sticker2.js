const { sticker } = require("../lib/sticker");

let handler = async (m, { conn, args, usedPrefix }) => {
  // Check if URL is provided
  if (!args[0])
    throw `Please provide an image URL\n\nExample: ${usedPrefix}sticker2 https://example.com/image.jpg`;

  // Check if user is replying to media (which this command doesn't handle)
  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || "";
  if (/image|video/.test(mime)) {
    throw `This command is only for creating stickers from URLs\nUse *${usedPrefix}sticker* for media files`;
  }

  try {
    // Create sticker from URL
    let stiker = await sticker(false, args[0], global.packname, global.author);

    // Send the sticker
    await conn.sendFile(m.chat, stiker, "sticker.webp", "", m, {
      mimetype: "image/webp",
      ephemeralExpiration: 86400, // 24-hour expiration
    });
  } catch (e) {
    throw `Failed to create sticker. Please check that:\n1. The URL is valid\n2. The image is accessible\n3. The URL points directly to an image file`;
  }
};

// Command info
handler.help = ["sticker2 <image-url>"];
handler.tags = ["sticker"];
handler.command = /^s(tic?ker)?2$/i; // Matches: s2, sticker2, sticer2

module.exports = handler;
