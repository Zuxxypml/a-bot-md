const { Image } = require("node-webpmux");
const util = require("util");

let handler = async (m, { conn }) => {
  if (!m.quoted) return m.reply("Please reply/tag a sticker!");

  try {
    // Check if the quoted message is a sticker
    if (!/sticker/.test(m.quoted.mtype)) {
      return m.reply("The message you replied to is not a sticker");
    }

    // Load the sticker image
    const img = new Image();
    const stickerBuffer = await m.quoted.download();
    await img.load(stickerBuffer);

    // Check if EXIF data exists
    if (!img.exif || img.exif.length <= 22) {
      return m.reply("No EXIF data found in this sticker");
    }

    // Parse and format the EXIF data
    const exifData = img.exif.slice(22); // Remove WebP header
    const parsedData = JSON.parse(exifData.toString());

    // Send formatted response
    await m.reply(`*Sticker EXIF Data:*\n${util.format(parsedData)}`);
  } catch (error) {
    console.error("EXIF Extraction Error:", error);

    if (error instanceof SyntaxError) {
      m.reply("Invalid EXIF data format - may not be JSON");
    } else {
      m.reply(`Failed to extract EXIF data: ${error.message}`);
    }
  }
};

handler.help = ["getexif"];
handler.tags = ["sticker", "tools"];
handler.command = /^getexif$/i;

module.exports = handler;
