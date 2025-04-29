const FormData = require("form-data");

let handler = async (m, { conn, usedPrefix, command }) => {
  conn.hdr = conn.hdr || {};
  const senderId = m.sender.split(`@`)[0];

  // Prevent multiple concurrent processes per user
  if (conn.hdr[m.sender]) {
    throw "🚧 You already have an ongoing process. Please wait until it finishes.";
  }

  // Identify the message (quoted or own)
  let q = m.quoted || m;
  let mime = (q.msg || q).mimetype || q.mediaType || "";

  // Validate presence of an image
  if (!mime) {
    throw `❓ Please reply to a photo or send a photo with caption *${
      usedPrefix + command
    }*.\n\nNote: This uses 1 limit.`;
  }
  if (!/image\/(jpe?g|png)/.test(mime)) {
    throw `❌ Unsupported format: ${mime}. Only JPEG or PNG allowed.`;
  }

  // Mark process started
  conn.hdr[m.sender] = true;
  m.reply("🕒 Downloading image...");
  let imgBuffer = await q.download();

  m.reply("✨ Image downloaded. Enhancing now...");

  let errorOccurred = false;
  try {
    // Call enhancement API
    const enhanced = await enhanceImage(imgBuffer);

    // Send back in multiple formats
    await conn.sendMessage(
      m.chat,
      {
        document: enhanced,
        mimetype: "image/jpeg",
        fileName: "enhanced.jpg",
        caption: `✅ Here’s your enhanced image (JPEG) @${senderId}`,
        mentions: [m.sender],
      },
      { quoted: m }
    );
    await conn.sendMessage(
      m.chat,
      {
        document: enhanced,
        mimetype: "image/png",
        fileName: "enhanced.png",
        caption: `✅ Here’s your enhanced image (PNG) @${senderId}`,
        mentions: [m.sender],
      },
      { quoted: m }
    );
    await conn.sendMessage(
      m.chat,
      { image: enhanced, caption: `✅ Enhanced image (JPEG) @${senderId}` },
      { quoted: m }
    );
    await conn.sendMessage(
      m.chat,
      { image: enhanced, caption: `✅ Enhanced image (PNG) @${senderId}` },
      { quoted: m }
    );
  } catch (err) {
    console.error(err);
    errorOccurred = true;
    m.reply("❌ Enhancement failed: " + err.message);
  } finally {
    // Clean up process flag
    delete conn.hdr[m.sender];
  }
};

handler.help = ["remini"];
handler.tags = ["tools"];
handler.command = /^(remini)$/i;
handler.limit = true;

module.exports = handler;

/**
 * Sends the image buffer to the enhancement API and returns the enhanced buffer.
 */
async function enhanceImage(buffer) {
  return new Promise((resolve, reject) => {
    const form = new FormData();
    form.append("model_version", 1);
    form.append("image", buffer, {
      filename: "input.jpg",
      contentType: "image/jpeg",
    });

    form.submit(
      {
        protocol: "https:",
        host: "inferenceengine.vyro.ai",
        path: "/enhance",
        headers: {
          "User-Agent": "okhttp/4.9.3",
          Connection: "Keep-Alive",
          "Accept-Encoding": "gzip",
        },
      },
      (err, res) => {
        if (err) return reject(err);
        const chunks = [];
        res
          .on("data", (chunk) => chunks.push(chunk))
          .on("end", () => resolve(Buffer.concat(chunks)))
          .on("error", (e) => reject(e));
      }
    );
  });
}
