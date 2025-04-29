const { sticker } = require("../lib/sticker"); // Import sticker creation function
const WSF = require("wa-sticker-formatter"); // Import sticker formatter library

let handler = async (m, { conn, args, usedPrefix, command }) => {
  let stiker = false; // Variable for regular stickers
  let wsf = false; // Variable for formatted stickers

  try {
    let q = m.quoted ? m.quoted : m; // Get quoted message or original message
    let mime = (q.msg || q).mimetype || ""; // Get MIME type

    // Handle different media types:
    if (/webp/.test(mime)) {
      // If WebP (existing sticker)
      let img = await q.download();
      if (!img) throw `Reply to a sticker with command ${usedPrefix + command}`;

      wsf = new WSF.Sticker(img, {
        pack: global.packname, // Set sticker pack name
        author: global.author, // Set author name
        crop: false, // Disable auto-cropping
      });
    } else if (/image/.test(mime)) {
      // If regular image
      let img = await q.download();
      if (!img) throw `Reply to an image with command ${usedPrefix + command}`;

      wsf = new WSF.Sticker(img, {
        pack: global.packname,
        author: global.author,
        crop: false,
      });
    } else if (/video/.test(mime)) {
      // If video/GIF
      if ((q.msg || q).seconds > 11) throw "Maximum 10 seconds!";
      let img = await q.download();
      if (!img) throw `Reply to a video with command ${usedPrefix + command}`;

      stiker = await sticker(img, false, global.packname, global.author);
    } else if (args[0]) {
      // If URL provided
      if (isUrl(args[0])) {
        stiker = await sticker(false, args[0], global.packname, global.author);
      } else {
        throw "Invalid URL!";
      }
    }
  } catch (e) {
    throw e; // Re-throw any errors
  } finally {
    // Send the created sticker if successful
    if (wsf) {
      await wsf.build(); // Build the formatted sticker
      const sticBuffer = await wsf.get(); // Get sticker buffer
      if (sticBuffer) {
        await conn.sendMessage(
          m.chat,
          { sticker: sticBuffer },
          {
            quoted: m,
            mimetype: "image/webp",
            ephemeralExpiration: 86400, // 24-hour expiration
          }
        );
      }
    }

    if (stiker) {
      await conn.sendMessage(
        m.chat,
        { sticker: stiker },
        {
          quoted: m,
          mimetype: "image/webp",
          ephemeralExpiration: 86400,
        }
      );
    }
  }
};

// Command configuration
handler.help = ["sticker (caption|reply media)"];
handler.tags = ["sticker"];
handler.command = /^(s(tic?ker)?(gif)?)$/i; // Matches: s, stic, sticker, sgif, etc.

// Permission settings
handler.owner = false;
handler.mods = false;
handler.premium = false;
handler.group = false;
handler.private = false;
handler.admin = false;
handler.botAdmin = false;

handler.fail = null;

module.exports = handler;

// URL validation helper function
const isUrl = (text) => {
  return text.match(
    new RegExp(
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)(jpe?g|gif|png)/,
      "gi"
    )
  );
};
